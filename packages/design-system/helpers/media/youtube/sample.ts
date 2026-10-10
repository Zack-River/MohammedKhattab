import type { YouTubeSession } from "./session";
import { readPlayerTime } from "./read-time";
import { failYouTubeSession } from "./fail";
export function sampleYouTubePlayer(session: YouTubeSession) {
  if (session.disposed || !session.player || document.hidden) return;
  try {
    const time = readPlayerTime(session.player);
    session.publish((current) => ({ ...current, ...time }));
  } catch { failYouTubeSession(session); }
}
