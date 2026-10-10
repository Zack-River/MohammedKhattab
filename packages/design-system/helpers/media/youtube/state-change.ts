import type { YouTubeSession } from "./session";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
import { sampleYouTubePlayer } from "./sample";
import { stopYouTubePolling } from "./polling";
export function changeYouTubeState(session: YouTubeSession, data: number | undefined) {
  if (session.disposed) return;
  const status = data === 1 ? "playing" : data === 3 ? "buffering" : data === 0 ? "ended" : "paused";
  session.publish((current) => ({ ...current, status }));
  stopYouTubePolling(session);
  sampleYouTubePlayer(session);
  if (status === "playing") {
    session.interval = window.setInterval(() => sampleYouTubePlayer(session), youtubePlayerPolicy.sampleMs);
    session.onPlay?.();
  }
  if (status === "ended") session.onEnded?.();
}
