import type { YouTubePlayerInstance } from "../../../types/video-player";
export function readPlayerTime(player: YouTubePlayerInstance) {
  const rawDuration = player.getDuration(),
    rawTime = player.getCurrentTime();
  const duration = Number.isFinite(rawDuration) ? Math.max(0, rawDuration) : 0;
  const time = Number.isFinite(rawTime)
    ? Math.max(0, Math.min(duration, rawTime))
    : 0;
  return { duration, time };
}
