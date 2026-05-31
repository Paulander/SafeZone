import { platformOverlays } from "@/lib/platform-overlays";

export function PhoneMockup() {
  const overlay = platformOverlays[0];

  return (
    <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] rounded-[2rem] border-[10px] border-slate-950 bg-slate-950 shadow-phone">
      <div className="phone-mask relative h-full w-full bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(25,199,216,0.7),transparent_27%),linear-gradient(160deg,#1f2937_0%,#111827_42%,#ff5b5f_100%)]" />
        <div className="absolute left-[13%] top-[13%] h-[30%] w-[54%] rounded-2xl border border-white/40 bg-white/12 p-4 text-white shadow-2xl backdrop-blur">
          <div className="h-2 w-16 rounded bg-white/80" />
          <div className="mt-4 h-14 rounded-xl bg-white/18" />
          <div className="mt-3 h-2 w-24 rounded bg-brand-lime" />
        </div>
        <div className="absolute bottom-[22%] left-[8%] right-[22%] rounded-xl bg-black/45 p-3 text-xs font-semibold text-white">
          Captions stay visible here.
        </div>
        {overlay.zones.map((zone) => (
          <div
            key={zone.id}
            className="absolute rounded-md border border-red-300/70 bg-red-500/24"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`
            }}
          />
        ))}
        <div className="absolute right-[6%] top-[43%] flex flex-col gap-3">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-9 w-9 rounded-full border border-white/25 bg-white/18 backdrop-blur" />
          ))}
        </div>
      </div>
      <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-slate-800" />
    </div>
  );
}
