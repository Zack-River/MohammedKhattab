import type { YouTubeSession } from "./session";
import type { YouTubePlayerInstance } from "../../../types/video-player";
import { readyYouTubePlayer } from "./ready";
import { changeYouTubeState } from "./state-change";
import { failYouTubeSession } from "./fail";
import { stopYouTubePolling } from "./polling";
export function youtubePlayerEvents(session: YouTubeSession) {
  return {
    onReady: ({ target }: { target: YouTubePlayerInstance }) => readyYouTubePlayer(session, target),
    onStateChange: ({ data }: { data?: number }) => changeYouTubeState(session, data),
    onError: () => failYouTubeSession(session),
    onAutoplayBlocked: () => {
      if (session.disposed) return;
      stopYouTubePolling(session);
      session.publish((current) => ({ ...current, status: "paused" }));
    },
  };
}
