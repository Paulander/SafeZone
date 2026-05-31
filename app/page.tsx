import Link from "next/link";
import { ArrowRight, CheckCircle2, Download, Eye, Layers3, ShieldCheck } from "lucide-react";
import { PhoneMockup } from "@/components/phone-mockup";
import { SiteHeader } from "@/components/site-header";

const keywordBlocks = [
  {
    title: "TikTok safe zone checker",
    copy: "Preview caption blocks, action buttons, profile chrome, and bottom navigation before the post goes live."
  },
  {
    title: "Instagram Reels safe zone",
    copy: "Check whether subtitles, faces, product shots, or a CTA will sit under the Reels interface."
  },
  {
    title: "YouTube Shorts overlay preview",
    copy: "Review Shorts UI coverage against vertical edits from CapCut, Premiere, DaVinci, Canva, and more."
  },
  {
    title: "Vertical video UI checker",
    copy: "A fast final QA pass for creators, editors, agencies, and social media managers."
  }
];

const workflow = [
  { icon: Download, title: "Upload locally", copy: "Drop an MP4 or WebM. The video is held with a browser object URL." },
  { icon: Layers3, title: "Switch overlays", copy: "Inspect TikTok, Reels, Shorts, and Spotlight safe zones from one view." },
  { icon: ShieldCheck, title: "Export proof", copy: "Save the current frame with the active overlay as a PNG for review notes." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />

      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(25,199,216,0.34),transparent_30%),radial-gradient(circle_at_18%_70%,rgba(255,91,95,0.24),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative mx-auto grid min-h-[78vh] max-w-6xl content-center px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:gap-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-lime">Vertical video safe-zone preview</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
              Preview TikTok, Reels & Shorts safe zones before posting.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Check whether captions, faces, CTAs, or products are hidden behind TikTok, Instagram Reels,
              YouTube Shorts, or Snapchat UI before you publish.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-lime px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-lime-300"
              >
                Try it free
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
          </div>
          <div className="pointer-events-none mt-10 lg:mt-0">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3">
        {workflow.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <item.icon className="h-7 w-7 text-slate-950" />
            <h2 className="mt-4 text-lg font-black text-slate-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
          </div>
        ))}
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Built for final checks</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Not a video editor. Just the posting QA pass.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              SafeFrameCheck is for teams that already finished the edit elsewhere and need a fast yes/no view
              before publishing. Upload, inspect, export proof, move on.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {keywordBlocks.map((block) => (
              <div key={block.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-base font-black text-slate-950">{block.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{block.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Pricing teaser</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Start free, upgrade when QA becomes a workflow.</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Free covers single-platform safe-zone preview. Pro is planned for side-by-side review, exports,
              saved presets, and future AI layout warnings.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {["Single-platform preview", "Basic overlays", "Pro comparison", "Proof image exports"].map((item) => (
              <p key={item} className="flex items-center gap-2 py-2 text-sm font-bold text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-brand-cyan" />
                {item}
              </p>
            ))}
            <Link
              href="/app"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Open checker
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
