import { describe, expect, it } from "vitest";
import { getDangerZones, platformOverlays } from "../lib/platform-overlays";

describe("platform overlays", () => {
  it("defines the expected MVP platforms", () => {
    expect(platformOverlays.map((overlay) => overlay.id)).toEqual(["tiktok", "instagram", "youtube", "snapchat"]);
  });

  it("keeps every zone inside normalized 9:16 bounds", () => {
    for (const overlay of platformOverlays) {
      for (const zone of overlay.zones) {
        expect(zone.x).toBeGreaterThanOrEqual(0);
        expect(zone.y).toBeGreaterThanOrEqual(0);
        expect(zone.width).toBeGreaterThan(0);
        expect(zone.height).toBeGreaterThan(0);
        expect(zone.x + zone.width).toBeLessThanOrEqual(100);
        expect(zone.y + zone.height).toBeLessThanOrEqual(100);
      }
    }
  });

  it("exposes warning zones for each platform", () => {
    for (const overlay of platformOverlays) {
      expect(getDangerZones(overlay.id).length).toBeGreaterThanOrEqual(3);
    }
  });
});
