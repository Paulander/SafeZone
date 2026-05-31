import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SafeFrameCheck | Vertical video safe zone checker",
    template: "%s | SafeFrameCheck"
  },
  description:
    "Preview TikTok, Instagram Reels, YouTube Shorts, and Snapchat UI overlays before posting vertical video.",
  keywords: [
    "TikTok safe zone checker",
    "Instagram Reels safe zone",
    "YouTube Shorts overlay preview",
    "vertical video UI checker",
    "safe zone preview"
  ],
  metadataBase: new URL("https://safeframecheck.com"),
  openGraph: {
    title: "SafeFrameCheck",
    description: "Check whether captions, faces, CTAs, or products are hidden by social app UI before posting.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
