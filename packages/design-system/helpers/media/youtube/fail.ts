import type { YouTubeSession } from "./session";
import { stopYouTubePolling } from "./polling";
export function failYouTubeSession(session: YouTubeSession) {
  if (session.disposed) return;
  stopYouTubePolling(session);
  clearTimeout(session.timeout);
  session.publish((current) => ({ ...current, status: "error", ready: false }));
}
