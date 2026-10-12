import { loadYouTubeAPI } from "./load-api";
import { getControlledYouTubeUrl } from "./controlled-url";
import { createYouTubeIframe } from "./iframe";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
import type { YouTubePlayerInstance } from "../../../types/video-player";
/** Read cued metadata without playing; dispose this probe independently of other players. */
export function probeYouTubeDuration(url: string, signal: AbortSignal, timeoutMs: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const source = getControlledYouTubeUrl(url, window.location.origin);
    if (!source || signal.aborted) { reject(new Error("YouTube metadata unavailable")); return; }
    const controlled = new URL(source); controlled.searchParams.set("autoplay", "0");
    const iframe = createYouTubeIframe(controlled.href, "Video metadata");
    iframe.hidden = true; iframe.setAttribute("aria-hidden", "true");
    let player: YouTubePlayerInstance | undefined, settled = false;
    const finish = (seconds?: number) => {
      if (settled) return;
      settled = true; clearTimeout(timeout); clearInterval(interval); signal.removeEventListener("abort", abort);
      try { player?.destroy(); } catch { /* The iframe may already have been removed by the SDK. */ }
      iframe.remove();
      if (seconds) resolve(seconds); else reject(new Error("YouTube metadata unavailable"));
    };
    const sample = () => {
      try { const seconds = player?.getDuration(); if (seconds && Number.isFinite(seconds) && seconds > 0) finish(Math.ceil(seconds)); }
      catch { finish(); }
    };
    const abort = () => finish(), timeout = window.setTimeout(abort, timeoutMs);
    const interval = window.setInterval(sample, youtubePlayerPolicy.sampleMs);
    signal.addEventListener("abort", abort, { once: true }); document.body.append(iframe);
    void loadYouTubeAPI().then(api => {
      if (settled) return;
      player = new api.Player(iframe, { events: {
        onReady: event => { player = event.target; sample(); }, onStateChange: sample,
        onError: abort, onAutoplayBlocked: sample,
      } });
    }).catch(abort);
  });
}
