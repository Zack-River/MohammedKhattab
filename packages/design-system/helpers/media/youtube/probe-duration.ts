import { loadYouTubeAPI } from "./load-api";
import { getControlledYouTubeUrl } from "./controlled-url";
import { createYouTubeIframe } from "./iframe";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
import type { YouTubePlayerInstance } from "../../../types/video-player";

function createHiddenProbeIframe(sourceUrl: string) {
  const normalized = sourceUrl.replace("youtube-nocookie.com", "www.youtube.com");
  const iframe = createYouTubeIframe(normalized, "Video metadata");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:200px;height:200px;opacity:0;pointer-events:none;";
  iframe.tabIndex = -1;
  iframe.setAttribute("aria-hidden", "true");
  return iframe;
}

export function probeYouTubeDuration(url: string, signal: AbortSignal, timeoutMs: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const source = getControlledYouTubeUrl(url, window.location.origin);
    if (!source || signal.aborted) { reject(new Error("YouTube metadata unavailable")); return; }
    const controlled = new URL(source);
    controlled.searchParams.set("autoplay", "1");
    controlled.searchParams.set("mute", "1");
    controlled.searchParams.set("playsinline", "1");
    const iframe = createHiddenProbeIframe(controlled.href);
    let player: YouTubePlayerInstance | undefined, settled = false;
    const finish = (seconds?: number) => {
      if (settled) return;
      settled = true; clearTimeout(timeout); clearInterval(interval); signal.removeEventListener("abort", abort);
      try { player?.pauseVideo(); player?.destroy(); } catch { /* Ignore */ }
      iframe.remove();
      if (seconds) resolve(seconds); else reject(new Error("YouTube metadata unavailable"));
    };
    const sample = () => {
      try { const sec = player?.getDuration(); if (sec && Number.isFinite(sec) && sec > 0) finish(Math.ceil(sec)); }
      catch { finish(); }
    };
    const abort = () => finish(), timeout = window.setTimeout(abort, timeoutMs), interval = window.setInterval(sample, youtubePlayerPolicy.sampleMs);
    signal.addEventListener("abort", abort, { once: true }); document.body.append(iframe);
    void loadYouTubeAPI().then(api => {
      if (settled) return;
      player = new api.Player(iframe, { events: {
        onReady: event => { player = event.target; try { player.mute(); player.playVideo(); } catch { /* Ignore */ } sample(); },
        onStateChange: sample, onError: abort, onAutoplayBlocked: sample,
      } });
    }).catch(abort);
  });
}
