import type { PlatformOverlay } from "@/lib/platform-overlays";

type DrawOptions = {
  video: HTMLVideoElement;
  overlay: PlatformOverlay;
  objectFit: "contain" | "cover";
  showSafeAreas: boolean;
  opacity: number;
};

const EXPORT_WIDTH = 1080;
const EXPORT_HEIGHT = 1920;

export function exportProofImage({
  video,
  overlay,
  objectFit,
  showSafeAreas,
  opacity
}: DrawOptions): string {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas export is not supported in this browser.");
  }

  drawVideoFrame(context, video, objectFit);
  drawOverlayZones(context, overlay, showSafeAreas, opacity);
  drawPlatformChrome(context, overlay, opacity);
  drawExportBadge(context, overlay.name);

  return canvas.toDataURL("image/png");
}

function drawVideoFrame(context: CanvasRenderingContext2D, video: HTMLVideoElement, objectFit: "contain" | "cover") {
  const videoWidth = video.videoWidth || EXPORT_WIDTH;
  const videoHeight = video.videoHeight || EXPORT_HEIGHT;
  const scale =
    objectFit === "cover"
      ? Math.max(EXPORT_WIDTH / videoWidth, EXPORT_HEIGHT / videoHeight)
      : Math.min(EXPORT_WIDTH / videoWidth, EXPORT_HEIGHT / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;
  const x = (EXPORT_WIDTH - width) / 2;
  const y = (EXPORT_HEIGHT - height) / 2;

  context.fillStyle = "#020617";
  context.fillRect(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT);
  context.drawImage(video, x, y, width, height);
}

function drawOverlayZones(
  context: CanvasRenderingContext2D,
  overlay: PlatformOverlay,
  showSafeAreas: boolean,
  opacity: number
) {
  for (const zone of overlay.zones) {
    if (zone.kind === "safe" && !showSafeAreas) {
      continue;
    }

    const x = (zone.x / 100) * EXPORT_WIDTH;
    const y = (zone.y / 100) * EXPORT_HEIGHT;
    const width = (zone.width / 100) * EXPORT_WIDTH;
    const height = (zone.height / 100) * EXPORT_HEIGHT;
    const isSafe = zone.kind === "safe";

    context.save();
    context.globalAlpha = Math.max(0.08, Math.min(opacity, 0.9));
    context.fillStyle = isSafe ? "rgba(185, 242, 77, 0.28)" : "rgba(255, 91, 95, 0.32)";
    context.strokeStyle = isSafe ? "rgba(185, 242, 77, 0.95)" : "rgba(255, 91, 95, 0.95)";
    context.lineWidth = 4;
    context.fillRect(x, y, width, height);
    context.strokeRect(x, y, width, height);
    context.restore();

    drawLabel(context, zone.label, x + 18, y + 42, isSafe);
  }
}

function drawPlatformChrome(context: CanvasRenderingContext2D, overlay: PlatformOverlay, opacity: number) {
  context.save();
  context.globalAlpha = Math.max(0.2, Math.min(opacity + 0.1, 1));
  context.fillStyle = "rgba(2, 6, 23, 0.58)";
  context.fillRect(0, 0, EXPORT_WIDTH, 112);
  context.fillRect(0, EXPORT_HEIGHT - 126, EXPORT_WIDTH, 126);

  context.fillStyle = "rgba(255, 255, 255, 0.88)";
  for (let index = 0; index < 5; index += 1) {
    context.beginPath();
    context.arc(EXPORT_WIDTH - 92, 760 + index * 132, 38, 0, Math.PI * 2);
    context.fill();
  }

  context.fillStyle = overlay.accent;
  context.fillRect(36, EXPORT_HEIGHT - 248, 480, 12);
  context.restore();
}

function drawLabel(context: CanvasRenderingContext2D, label: string, x: number, y: number, isSafe: boolean) {
  context.save();
  context.font = "700 32px Arial";
  context.textBaseline = "middle";
  const metrics = context.measureText(label);
  context.fillStyle = isSafe ? "rgba(37, 99, 235, 0.92)" : "rgba(127, 29, 29, 0.92)";
  context.fillRect(x - 10, y - 25, metrics.width + 20, 50);
  context.fillStyle = "#ffffff";
  context.fillText(label, x, y);
  context.restore();
}

function drawExportBadge(context: CanvasRenderingContext2D, platformName: string) {
  const label = `SafeFrameCheck proof - ${platformName}`;
  context.save();
  context.font = "700 28px Arial";
  const metrics = context.measureText(label);
  context.fillStyle = "rgba(2, 6, 23, 0.72)";
  context.fillRect(32, 32, metrics.width + 40, 56);
  context.fillStyle = "#ffffff";
  context.fillText(label, 52, 69);
  context.restore();
}
