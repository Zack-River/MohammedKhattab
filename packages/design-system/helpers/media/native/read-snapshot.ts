import type { PlayerSnapshot } from "../../../types/video-player";
export function readNativeSnapshot(video: HTMLVideoElement, previous: PlayerSnapshot): PlayerSnapshot {
  const status = video.error ? "error" : video.ended ? "ended" : video.paused ? "paused"
    : video.readyState < 3 ? "buffering" : "playing";
  return {
    status: video.readyState === 0 && !video.error ? previous.status : status,
    ready: video.readyState >= 1 && !video.error,
    time: Number.isFinite(video.currentTime) ? video.currentTime : 0,
    duration: Number.isFinite(video.duration) ? video.duration : 0,
    volume: Math.round(video.volume * 100), muted: video.muted,
  };
}
