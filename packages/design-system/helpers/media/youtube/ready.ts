import type { YouTubeSession } from "./session";
import type { YouTubePlayerInstance } from "../../../types/video-player";
import { readPlayerTime } from "./read-time";
import { initialPlayerSnapshot } from "../initial-snapshot";
export function readyYouTubePlayer(session: YouTubeSession, target: YouTubePlayerInstance) {
  if (session.disposed) return;
  clearTimeout(session.timeout);
  session.playerRef.current = target;
  session.player = target;
  session.publish({ ...initialPlayerSnapshot(), ...readPlayerTime(target), ready: true,
    status: "paused", volume: target.getVolume(), muted: target.isMuted() });
  target.playVideo();
}
