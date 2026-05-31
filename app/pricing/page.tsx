import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Pricing",
  description: "SafeFrameCheck pricing for creators, editors, agencies, and social media managers."
};

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    description: "For one-off final checks before posting.",
    features: ["Single-platform preview", "Basic platform overlays", "Local browser-only uploads", "Non-9:16 warning"]
  },
  {
    name: "Pro",
    price: "$7",
    cadence: "per month",
    description: "For repeat QA, teams, and review proofing.",
    features: [
      "Side-by-side comparison",
      "Proof image exports",
      "Saved overlay presets",
      "AI layout warnings later",
      "$29/year option planned"
    ],
    highlighted: true
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Pricing</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Simple pricing for a simple publishing check.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            SafeFrameCheck is built as a micro-SaaS utility. Stripe is intentionally stubbed until production
            secrets and price IDs are available.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm ${
                plan.highlighted ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-950"
              }`}
            >
              <h2 className="text-2xl font-black">{plan.name}</h2>
              <p className={`mt-2 text-sm leading-6 ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>
                {plan.description}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`pb-2 text-sm font-bold ${plan.highlighted ? "text-slate-300" : "text-slate-500"}`}>
                  {plan.cadence}
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <p key={feature} className="flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 className={plan.highlighted ? "h-5 w-5 text-brand-lime" : "h-5 w-5 text-brand-cyan"} />
                    {feature}
                  </p>
                ))}
              </div>
              <Link
                href="/app"
                className={`mt-7 inline-flex rounded-lg px-4 py-3 text-sm font-black transition ${
                  plan.highlighted
                    ? "bg-brand-lime text-slate-950 hover:bg-lime-300"
                    : "bg-slate-950 text-white hover:bg-slate-800"
                }`}
              >
                Try it free
              </Link>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Stripe Checkout TODO</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Add a server route for Stripe Checkout once production secrets are available. Expected environment
            variables: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_PRICE_PRO_MONTHLY,
            STRIPE_PRICE_PRO_YEARLY.
          </p>
        </section>
      </section>
    </main>
  );
}
