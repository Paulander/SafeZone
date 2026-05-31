export const MAX_VIDEO_FILE_SIZE = 500 * 1024 * 1024;
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const NINE_BY_SIXTEEN_RATIO = 9 / 16;

export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  const precision = value >= 10 || Number.isInteger(value) || index === 0 ? 0 : 1;

  return `${value.toFixed(precision)} ${units[index]}`;
}

export function isAcceptedVideoType(file: File): boolean {
  return ACCEPTED_VIDEO_TYPES.includes(file.type);
}

export function isNearNineBySixteen(width: number, height: number): boolean {
  if (width <= 0 || height <= 0) {
    return false;
  }

  const ratio = width / height;
  return Math.abs(ratio - NINE_BY_SIXTEEN_RATIO) <= 0.04;
}

export function validateVideoFile(file: File): string | null {
  if (!isAcceptedVideoType(file)) {
    return "Upload an MP4 or WebM video.";
  }

  if (file.size > MAX_VIDEO_FILE_SIZE) {
    return `Keep videos under ${formatBytes(MAX_VIDEO_FILE_SIZE)} for browser-only preview.`;
  }

  return null;
}
