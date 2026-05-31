import { describe, expect, it } from "vitest";
import { formatBytes, isNearNineBySixteen } from "../lib/video";

describe("video helpers", () => {
  it("formats file sizes for upload status", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(2.5 * 1024 * 1024)).toBe("2.5 MB");
  });

  it("detects common vertical 9:16 dimensions", () => {
    expect(isNearNineBySixteen(1080, 1920)).toBe(true);
    expect(isNearNineBySixteen(720, 1280)).toBe(true);
    expect(isNearNineBySixteen(1920, 1080)).toBe(false);
  });
});
