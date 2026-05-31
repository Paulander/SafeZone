"use client";

import {
  AlertTriangle,
  Download,
  Expand,
  FileVideo,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  Wand2
} from "lucide-react";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { exportProofImage } from "@/lib/export-proof";
import {
  getPlatformOverlay,
  platformOverlays,
  type PlatformId,
  type PlatformOverlay
} from "@/lib/platform-overlays";
import { formatBytes, isNearNineBySixteen, validateVideoFile } from "@/lib/video";

type FitMode = "contain" | "cover";

type UploadedVideo = {
  name: string;
  size: number;
  url: string;
};

const comparisonPlatforms: PlatformId[] = ["tiktok", "instagram", "youtube"];

export function VideoChecker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("tiktok");
  const [opacity, setOpacity] = useState(0.62);
  const [showZones, setShowZones] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>("contain");
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoWarning, setVideoWarning] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const overlay = useMemo(() => getPlatformOverlay(selectedPlatform), [selectedPlatform]);

  useEffect(() => {
    return () => {
      if (uploadedVideo?.url) {
        URL.revokeObjectURL(uploadedVideo.url);
      }
    };
  }, [uploadedVideo?.url]);

  function loadFile(file: File) {
    const validationMessage = validateVideoFile(file);
    setExportStatus(null);
    setVideoWarning(null);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError(null);
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);

    if (uploadedVideo?.url) {
      URL.revokeObjectURL(uploadedVideo.url);
    }

    setUploadedVideo({
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file)
    });
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
      event.target.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];

    if (file) {
      loadFile(file);
    }
  }

  function handleMetadataLoaded() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setDuration(video.duration || 0);
    if (!isNearNineBySixteen(video.videoWidth, video.videoHeight)) {
      setVideoWarning(
        `This video is ${video.videoWidth}x${video.videoHeight}, not 9:16. Preview still works; switch contain/cover to inspect framing.`
      );
    }
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    setIsPlaying(!video.paused);
  }

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || !uploadedVideo) {
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function seekTo(value: number) {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = value;
    setCurrentTime(value);
  }

  function resetVideo() {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  }

  function downloadProofImage() {
    const video = videoRef.current;

    try {
      if (!video || !uploadedVideo || video.readyState < 2) {
        setExportStatus("Load a video frame before exporting.");
        return;
      }

      const dataUrl = exportProofImage({
        video,
        overlay,
        objectFit: fitMode,
        showSafeAreas: showZones,
        opacity
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `safeframecheck-${overlay.id}-${Date.now()}.png`;
      link.click();
      setExportStatus("Proof image exported as PNG.");
    } catch (caughtError) {
      setExportStatus(caughtError instanceof Error ? caughtError.message : "Export failed. Try another browser.");
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className={isExpanded ? "fixed inset-0 z-[80] overflow-auto bg-slate-950 p-4" : ""}>
        <div className={isExpanded ? "mx-auto max-w-5xl" : ""}>
          <CheckerToolbar
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            opacity={opacity}
            setOpacity={setOpacity}
            showZones={showZones}
            setShowZones={setShowZones}
            fitMode={fitMode}
            setFitMode={setFitMode}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            onExport={downloadProofImage}
            hasVideo={Boolean(uploadedVideo)}
          />

          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(260px,440px)_1fr]">
            <div>
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[440px] rounded-[2rem] border-[10px] border-slate-950 bg-slate-950 shadow-phone">
                <div className="phone-mask checker-grid relative h-full w-full bg-slate-950">
                  {uploadedVideo ? (
                    <video
                      ref={videoRef}
                      src={uploadedVideo.url}
                      className={`absolute inset-0 h-full w-full ${fitMode === "cover" ? "object-cover" : "object-contain"}`}
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={handleMetadataLoaded}
                      onTimeUpdate={handleTimeUpdate}
                      onPause={() => setIsPlaying(false)}
                      onPlay={() => setIsPlaying(true)}
                    />
                  ) : (
                    <UploadDropzone
                      isDragOver={isDragOver}
                      setIsDragOver={setIsDragOver}
                      onDrop={handleDrop}
                      onPick={() => inputRef.current?.click()}
                    />
                  )}

                  {uploadedVideo ? (
                    <OverlayCanvas overlay={overlay} opacity={opacity} showZones={showZones} />
                  ) : null}

                  <div className="pointer-events-none absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/24" />
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="video/mp4,video/webm"
                className="hidden"
                onChange={handleInputChange}
              />

              {uploadedVideo ? (
                <div
                  className={`mt-4 rounded-xl border border-dashed p-4 transition ${
                    isDragOver ? "border-brand-cyan bg-cyan-50" : "border-slate-300 bg-white"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                >
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <Upload size={17} />
                    Replace video
                  </button>
                  <p className="mt-2 text-center text-xs font-medium text-slate-500">
                    MP4/WebM, browser-only, max 500 MB
                  </p>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <VideoControls
                uploadedVideo={uploadedVideo}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onTogglePlayback={togglePlayback}
                onReset={resetVideo}
                onSeek={seekTo}
              />

              <StatusPanel
                overlay={overlay}
                uploadedVideo={uploadedVideo}
                error={error}
                videoWarning={videoWarning}
                exportStatus={exportStatus}
              />

              <AiLayoutCheckerPanel />
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <ComparisonPanel videoUrl={uploadedVideo?.url ?? null} opacity={opacity} showZones={showZones} fitMode={fitMode} />
        <PricingNudge />
      </aside>
    </div>
  );
}

function UploadDropzone({
  isDragOver,
  setIsDragOver,
  onDrop,
  onPick
}: {
  isDragOver: boolean;
  setIsDragOver: (value: boolean) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onPick: () => void;
}) {
  return (
    <div
      className={`absolute inset-4 grid place-items-center rounded-[1.4rem] border-2 border-dashed p-6 text-center transition ${
        isDragOver ? "border-brand-cyan bg-cyan-400/10" : "border-white/20 bg-white/6"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={onDrop}
    >
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white text-slate-950">
          <FileVideo size={30} />
        </div>
        <h2 className="mt-5 text-2xl font-black tracking-tight text-white">Drop a vertical video</h2>
        <p className="mt-2 text-sm font-medium text-slate-300">MP4 or WebM. Your file stays in this browser.</p>
        <button
          type="button"
          onClick={onPick}
          className="mt-5 rounded-lg bg-brand-lime px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-lime-300"
        >
          Choose video
        </button>
      </div>
    </div>
  );
}

function CheckerToolbar({
  selectedPlatform,
  setSelectedPlatform,
  opacity,
  setOpacity,
  showZones,
  setShowZones,
  fitMode,
  setFitMode,
  isExpanded,
  setIsExpanded,
  onExport,
  hasVideo
}: {
  selectedPlatform: PlatformId;
  setSelectedPlatform: (value: PlatformId) => void;
  opacity: number;
  setOpacity: (value: number) => void;
  showZones: boolean;
  setShowZones: (value: boolean) => void;
  fitMode: FitMode;
  setFitMode: (value: FitMode) => void;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  onExport: () => void;
  hasVideo: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {platformOverlays.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => setSelectedPlatform(platform.id)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                selectedPlatform === platform.id
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {platform.shortName}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            Opacity
            <input
              type="range"
              min="0.2"
              max="0.9"
              step="0.05"
              value={opacity}
              onChange={(event) => setOpacity(Number(event.target.value))}
              className="w-28 accent-slate-950"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowZones(!showZones)}
            className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
              showZones ? "bg-brand-lime text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {showZones ? "Zones on" : "Zones off"}
          </button>
          <button
            type="button"
            onClick={() => setFitMode(fitMode === "contain" ? "cover" : "contain")}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
          >
            {fitMode === "contain" ? "Contain" : "Cover"}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            aria-label={isExpanded ? "Exit large preview" : "Open large preview"}
            title={isExpanded ? "Exit large preview" : "Open large preview"}
          >
            {isExpanded ? <Expand size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            type="button"
            onClick={onExport}
            disabled={!hasVideo}
            className="flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Download size={16} />
            Export PNG
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoControls({
  uploadedVideo,
  currentTime,
  duration,
  isPlaying,
  onTogglePlayback,
  onReset,
  onSeek
}: {
  uploadedVideo: UploadedVideo | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onTogglePlayback: () => void;
  onReset: () => void;
  onSeek: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Playback</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-950">
            {uploadedVideo ? uploadedVideo.name : "No video loaded"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onTogglePlayback}
            disabled={!uploadedVideo}
            className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label={isPlaying ? "Pause video" : "Play video"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={!uploadedVideo}
            className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-300"
            aria-label="Reset video"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max={duration || 0}
        step="0.01"
        value={Math.min(currentTime, duration || 0)}
        onChange={(event) => onSeek(Number(event.target.value))}
        disabled={!uploadedVideo || duration === 0}
        className="mt-4 w-full accent-slate-950"
      />
      <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function StatusPanel({
  overlay,
  uploadedVideo,
  error,
  videoWarning,
  exportStatus
}: {
  overlay: PlatformOverlay;
  uploadedVideo: UploadedVideo | null;
  error: string | null;
  videoWarning: string | null;
  exportStatus: string | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Current overlay</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{overlay.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{overlay.notes}</p>
        </div>
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: overlay.accent }} />
      </div>

      <div className="mt-4 grid gap-2">
        {uploadedVideo ? (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            {uploadedVideo.name} - {formatBytes(uploadedVideo.size)}
          </p>
        ) : (
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500">
            Upload a 9:16 MP4 or WebM to begin checking.
          </p>
        )}
        {error ? <AlertMessage tone="error" message={error} /> : null}
        {videoWarning ? <AlertMessage tone="warning" message={videoWarning} /> : null}
        {exportStatus ? <AlertMessage tone="info" message={exportStatus} /> : null}
      </div>

      <div className="mt-4 grid gap-2">
        {overlay.zones
          .filter((zone) => zone.kind === "danger")
          .map((zone) => (
            <div key={zone.id} className="rounded-lg border border-red-100 bg-red-50 px-3 py-2">
              <p className="text-sm font-black text-red-950">{zone.label}</p>
              <p className="mt-1 text-xs leading-5 text-red-800">{zone.description}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

function AlertMessage({ tone, message }: { tone: "error" | "warning" | "info"; message: string }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-cyan-200 bg-cyan-50 text-cyan-900"
  };

  return (
    <p className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${styles[tone]}`}>
      <AlertTriangle className="mt-0.5 shrink-0" size={16} />
      {message}
    </p>
  );
}

function AiLayoutCheckerPanel() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white shadow-sm">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-lime text-slate-950">
          <Wand2 size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Future Pro</p>
          <h2 className="text-lg font-black">AI Layout Checker</h2>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Planned CV checks will detect faces, captions, products, and CTAs, then flag collisions with each
        platform UI zone. No external AI APIs are called in this MVP.
      </p>
      <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-200">
        <p className="rounded-lg bg-white/8 px-3 py-2">Face too close to right action rail</p>
        <p className="rounded-lg bg-white/8 px-3 py-2">CTA overlaps lower caption area</p>
      </div>
    </div>
  );
}

function PricingNudge() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-brand-violet" />
        <h2 className="text-lg font-black text-slate-950">Pro workflow</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Exports, saved presets, side-by-side QA, and future AI layout warnings are scoped for the paid tier.
      </p>
      <a
        href="/pricing"
        className="mt-4 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        View pricing
      </a>
    </div>
  );
}

function ComparisonPanel({
  videoUrl,
  opacity,
  showZones,
  fitMode
}: {
  videoUrl: string | null;
  opacity: number;
  showZones: boolean;
  fitMode: FitMode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Cross-platform</p>
          <h2 className="mt-1 text-lg font-black text-slate-950">Side-by-side preview</h2>
        </div>
        <span className="rounded-full bg-brand-lime px-2.5 py-1 text-xs font-black text-slate-950">Pro preview</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {comparisonPlatforms.map((platformId) => {
          const platform = getPlatformOverlay(platformId);
          return (
            <div key={platform.id}>
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-slate-950">
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className={`absolute inset-0 h-full w-full ${fitMode === "cover" ? "object-cover" : "object-contain"}`}
                  />
                ) : (
                  <div className="absolute inset-0 checker-grid" />
                )}
                <OverlayCanvas overlay={platform} opacity={opacity} showZones={showZones} compact />
              </div>
              <p className="mt-2 text-center text-xs font-black text-slate-700">{platform.shortName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OverlayCanvas({
  overlay,
  opacity,
  showZones,
  compact = false
}: {
  overlay: PlatformOverlay;
  opacity: number;
  showZones: boolean;
  compact?: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 top-0 h-[10%] bg-slate-950/45" style={{ opacity: Math.min(opacity, 0.75) }} />
      <div className="absolute inset-x-0 bottom-0 h-[10%] bg-slate-950/50" style={{ opacity: Math.min(opacity, 0.75) }} />
      <div className="absolute right-[5%] top-[38%] flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className={compact ? "h-3 w-3 rounded-full bg-white/80" : "h-9 w-9 rounded-full bg-white/82 shadow"}
          />
        ))}
      </div>

      {showZones
        ? overlay.zones.map((zone) => (
            <div
              key={zone.id}
              className={`absolute rounded-md border ${
                zone.kind === "safe" ? "border-lime-300 bg-lime-300/20" : "border-red-300 bg-red-500/28"
              }`}
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
                opacity
              }}
            >
              {!compact ? (
                <span
                  className={`absolute left-1 top-1 max-w-[92%] rounded px-2 py-1 text-[11px] font-black leading-tight text-white ${
                    zone.kind === "safe" ? "bg-blue-700/80" : "bg-red-950/82"
                  }`}
                >
                  {zone.label}
                </span>
              ) : null}
            </div>
          ))
        : null}
    </div>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
