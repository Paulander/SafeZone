export type PlatformId = "tiktok" | "instagram" | "youtube" | "snapchat";

export type OverlayZoneKind = "danger" | "safe";

export type OverlayZone = {
  id: string;
  label: string;
  kind: OverlayZoneKind;
  x: number;
  y: number;
  width: number;
  height: number;
  anchor: "top" | "right" | "bottom" | "left" | "center";
  description: string;
};

export type PlatformOverlay = {
  id: PlatformId;
  name: string;
  shortName: string;
  accent: string;
  notes: string;
  zones: OverlayZone[];
};

export const platformOverlays: PlatformOverlay[] = [
  {
    id: "tiktok",
    name: "TikTok",
    shortName: "TikTok",
    accent: "#19c7d8",
    notes: "Approximates profile/search chrome, right action rail, caption block, and bottom navigation.",
    zones: [
      zone("tiktok-top", "Top search/profile area", "danger", 0, 0, 100, 12, "top"),
      zone("tiktok-right", "Right engagement buttons", "danger", 78, 33, 20, 38, "right"),
      zone("tiktok-caption", "Bottom caption area", "danger", 0, 69, 74, 19, "bottom"),
      zone("tiktok-nav", "Bottom navigation", "danger", 0, 88, 100, 12, "bottom"),
      zone("tiktok-safe", "Central safe area", "safe", 8, 15, 64, 50, "center")
    ]
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    shortName: "Reels",
    accent: "#ff5b5f",
    notes: "Approximates Reels top controls, right action rail, profile/caption block, and app navigation.",
    zones: [
      zone("instagram-top", "Top camera/search area", "danger", 0, 0, 100, 11, "top"),
      zone("instagram-right", "Right engagement buttons", "danger", 79, 37, 19, 37, "right"),
      zone("instagram-caption", "Bottom profile/caption area", "danger", 0, 72, 76, 16, "bottom"),
      zone("instagram-nav", "Bottom navigation", "danger", 0, 90, 100, 10, "bottom"),
      zone("instagram-safe", "Central safe area", "safe", 8, 14, 65, 53, "center")
    ]
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    shortName: "Shorts",
    accent: "#ff0033",
    notes: "Approximates Shorts top app controls, right action rail, title/channel area, and bottom chrome.",
    zones: [
      zone("youtube-top", "Top app controls", "danger", 0, 0, 100, 10, "top"),
      zone("youtube-right", "Right engagement buttons", "danger", 76, 36, 22, 42, "right"),
      zone("youtube-title", "Bottom title/channel area", "danger", 0, 73, 74, 17, "bottom"),
      zone("youtube-nav", "Bottom navigation", "danger", 0, 90, 100, 10, "bottom"),
      zone("youtube-safe", "Central safe area", "safe", 8, 13, 63, 55, "center")
    ]
  },
  {
    id: "snapchat",
    name: "Snapchat Spotlight",
    shortName: "Snap",
    accent: "#fffc00",
    notes: "Approximates Spotlight top controls, right action stack, lower caption controls, and reply area.",
    zones: [
      zone("snapchat-top", "Top profile/search area", "danger", 0, 0, 100, 13, "top"),
      zone("snapchat-right", "Right engagement buttons", "danger", 78, 31, 20, 40, "right"),
      zone("snapchat-caption", "Bottom caption/reply area", "danger", 0, 72, 80, 16, "bottom"),
      zone("snapchat-nav", "Bottom controls", "danger", 0, 88, 100, 12, "bottom"),
      zone("snapchat-safe", "Central safe area", "safe", 8, 16, 65, 51, "center")
    ]
  }
];

export function getPlatformOverlay(id: PlatformId): PlatformOverlay {
  const overlay = platformOverlays.find((item) => item.id === id);

  if (!overlay) {
    throw new Error(`Unknown platform overlay: ${id}`);
  }

  return overlay;
}

export function getDangerZones(id: PlatformId): OverlayZone[] {
  return getPlatformOverlay(id).zones.filter((zoneItem) => zoneItem.kind === "danger");
}

function zone(
  id: string,
  label: string,
  kind: OverlayZoneKind,
  x: number,
  y: number,
  width: number,
  height: number,
  anchor: OverlayZone["anchor"]
): OverlayZone {
  return {
    id,
    label,
    kind,
    x,
    y,
    width,
    height,
    anchor,
    description: `${label} can hide captions, faces, calls to action, or product details.`
  };
}
