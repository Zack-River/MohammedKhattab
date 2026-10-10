import type { YouTubeAPI } from "../../../types/video-player";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
type APIWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
export function requestYouTubeAPI(scope: APIWindow): Promise<YouTubeAPI> {
  return new Promise((resolve, reject) => {
    const previous = scope.onYouTubeIframeAPIReady;
    const script = document.getElementById(youtubePlayerPolicy.scriptId) as HTMLScriptElement | null ?? document.createElement("script");
    const cleanup = () => {
      clearTimeout(timeout);
      script.removeEventListener("error", failed);
      if (scope.onYouTubeIframeAPIReady === ready) scope.onYouTubeIframeAPIReady = previous;
    };
    const failed = () => {
      cleanup();
      script.remove();
      reject(new Error("YouTube API unavailable"));
    };
    const ready = () => {
      cleanup();
      if (scope.YT?.Player) resolve(scope.YT);
      else reject(new Error("YouTube API missing"));
      previous?.();
    };
    const timeout = window.setTimeout(failed, youtubePlayerPolicy.timeoutMs);
    scope.onYouTubeIframeAPIReady = ready;
    script.addEventListener("error", failed, { once: true });
    if (!script.isConnected) {
      script.id = youtubePlayerPolicy.scriptId;
      script.src = youtubePlayerPolicy.apiUrl;
      script.async = true;
      document.head.append(script);
    }
  });
}
