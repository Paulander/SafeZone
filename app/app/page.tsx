import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { VideoChecker } from "@/components/video-checker";

export const metadata: Metadata = {
  title: "Safe Zone Checker App",
  description: "Upload a vertical video and preview social platform UI overlays in the browser."
};

export default function AppPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Browser-only MVP</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Check platform UI coverage before you publish.
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Drop a 9:16 MP4/WebM, switch overlays, scrub to the risky frame, and export a proof PNG.
            Nothing is uploaded to a server.
          </p>
        </div>
      </section>
      <VideoChecker />
    </main>
  );
}
