# SafeFrameCheck

SafeFrameCheck is a browser-based vertical video safe-zone preview tool for creators, editors, agencies, and social media managers. Upload a 9:16 MP4/WebM, switch between TikTok, Instagram Reels, YouTube Shorts, and Snapchat Spotlight overlays, then check whether captions, faces, CTAs, or product shots are hidden by platform UI.

The MVP is intentionally client-side. Uploaded videos are kept in browser memory through object URLs and are not sent to a server.

## Features

- Landing page with SEO copy for TikTok safe zone checker, Instagram Reels safe zone, YouTube Shorts overlay preview, and vertical video UI checker.
- `/app` checker with drag/drop upload, platform tabs, overlay opacity, danger/safe zone toggle, contain/cover fit, playback, scrubbing, and large preview mode.
- Cross-platform comparison panel marked as a Pro preview.
- PNG proof image export using Canvas.
- Pricing page with Free and Pro scaffolding.
- AI Layout Checker placeholder panel with no external API calls.
- Client-side MP4/WebM validation, max file size checks, and non-9:16 warnings.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

## Deployment

This is a standard Next.js App Router app and can be deployed to Vercel or any host that supports Next.js.

```bash
npm run build
```

No backend is required for the MVP.

## How To Update Platform Overlay Coordinates

Overlay definitions live in `lib/platform-overlays.ts`.

Each zone uses normalized percentage coordinates against a 9:16 frame:

- `x` and `y`: top-left position from 0 to 100.
- `width` and `height`: zone size from 0 to 100.
- `kind`: `danger` for blocked UI areas or `safe` for suggested content areas.
- `label`: user-facing warning text shown in the checker.

When TikTok, Reels, Shorts, or Snapchat UI changes, update only the relevant platform object in `platformOverlays`. Run tests afterward to confirm all zones stay inside frame bounds:

```bash
npm run test
```

## Monetization / Stripe TODO

Stripe is not integrated because production secrets and price IDs are not available. The pricing page and `.env.example` include the expected placeholders:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_PRO_YEARLY`

Suggested implementation steps:

1. Add `stripe` as a dependency.
2. Create a server route such as `app/api/checkout/route.ts`.
3. Read the selected plan and call Stripe Checkout with `STRIPE_PRICE_PRO_MONTHLY` or `STRIPE_PRICE_PRO_YEARLY`.
4. Add webhook handling for subscription state.
5. Gate Pro features such as saved presets, proof exports, and AI layout warnings behind authenticated subscription state.

## AI Layout Checker TODO

The current panel is a non-functional premium placeholder. A future implementation can add computer vision to detect faces, captions, CTAs, and products, then compare detected bounding boxes with `danger` zones from `lib/platform-overlays.ts`. No external AI or CV APIs are called in this MVP.
