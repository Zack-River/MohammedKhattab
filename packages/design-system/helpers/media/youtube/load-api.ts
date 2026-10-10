import type { YouTubeAPI } from "../../../types/video-player";
import { requestYouTubeAPI } from "./request-api";
let pending: Promise<YouTubeAPI> | undefined;
/** One SDK request shared by players; a rejected request can be retried. */
export function loadYouTubeAPI(): Promise<YouTubeAPI> {
  const scope = window as Window & { YT?: YouTubeAPI };
  if (scope.YT?.Player) return Promise.resolve(scope.YT);
  if (!pending) pending = requestYouTubeAPI(scope).catch((error) => {
    pending = undefined;
    throw error;
  });
  return pending;
}
