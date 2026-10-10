import { boundedNumber } from "../bounded-number";
export function setNativeVolume(video: HTMLVideoElement | null, value: number) {
  const level = boundedNumber(value, 100);
  if (!video || level === null) return;
  video.volume = level / 100;
  video.muted = level === 0;
}
