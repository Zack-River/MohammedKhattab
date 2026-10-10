import type { YouTubeSession } from "./session";
import { loadYouTubeAPI } from "./load-api";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
import { createYouTubeIframe } from "./iframe";
import { youtubePlayerEvents } from "./events";
import { failYouTubeSession } from "./fail";
import { stopYouTubePolling } from "./polling";
/** SDK owns the iframe; the component owns the empty host and session. */
export interface YouTubeMountOptions {
  host: HTMLDivElement;
  url: string;
  title: string;
  session: YouTubeSession;
  loadAPI?: typeof loadYouTubeAPI;
  timeoutMs?: number;
}
export function mountYouTubePlayer({ host, url, title, session, loadAPI = loadYouTubeAPI, timeoutMs = youtubePlayerPolicy.timeoutMs }: YouTubeMountOptions) {
  session.timeout = window.setTimeout(() => failYouTubeSession(session), timeoutMs);
  const iframe = createYouTubeIframe(url, title);
  host.append(iframe);
  loadAPI().then((api) => {
    if (!session.disposed) session.player = new api.Player(iframe, { events: youtubePlayerEvents(session) });
  }).catch(() => failYouTubeSession(session));
  return () => {
    session.disposed = true;
    clearTimeout(session.timeout);
    stopYouTubePolling(session);
    session.playerRef.current = null;
    session.player?.destroy();
    host.replaceChildren();
  };
}
