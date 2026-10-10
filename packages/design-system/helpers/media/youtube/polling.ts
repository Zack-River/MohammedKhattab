import type { YouTubeSession } from "./session";
export function stopYouTubePolling(session: YouTubeSession) {
  clearInterval(session.interval);
  session.interval = undefined;
}
