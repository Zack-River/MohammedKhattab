import { loadYouTubeAPI } from "./load-api";
import { extractYouTubeId } from "../../../lib/video";
import { youtubePlayerPolicy } from "../../../config/youtube-player";
import type { YouTubeAPI, YouTubePlayerInstance } from "../../../types/video-player";

function createProbeHost() {
  const container = document.createElement("div");
  container.id = `yt-probe-${Math.random().toString(36).slice(2, 9)}`;
  container.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:200px;height:200px;opacity:0;pointer-events:none;";
  container.setAttribute("aria-hidden", "true");
  document.body.append(container);
  return container;
}

function initProbePlayer(
  api: YouTubeAPI,
  containerId: string,
  videoId: string,
  onSample: () => void,
  onAbort: () => void,
) {
  return new api.Player(containerId, {
    videoId,
    playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, origin: window.location.origin },
    events: {
      onReady: (event) => { try { event.target.mute(); event.target.playVideo(); } catch { /* Ignore */ } onSample(); },
      onStateChange: onSample,
      onError: onAbort,
      onAutoplayBlocked: onSample,
    },
  });
}

export function probeYouTubeDuration(url: string, signal: AbortSignal, timeoutMs: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const videoId = extractYouTubeId(url);
    if (!videoId || signal.aborted) { reject(new Error("YouTube metadata unavailable")); return; }
    const container = createProbeHost();
    let player: YouTubePlayerInstance | undefined, settled = false;
    const finish = (seconds?: number) => {
      if (settled) return;
      settled = true; clearTimeout(timeout); clearInterval(interval); signal.removeEventListener("abort", abort);
      try { player?.pauseVideo(); player?.destroy(); } catch { /* Ignore */ }
      container.remove();
      if (seconds) resolve(seconds); else reject(new Error("YouTube metadata unavailable"));
    };
    const sample = () => {
      try { const sec = player?.getDuration(); if (sec && Number.isFinite(sec) && sec > 0) finish(Math.ceil(sec)); }
      catch { finish(); }
    };
    const abort = () => finish(), timeout = window.setTimeout(abort, timeoutMs);
    const interval = window.setInterval(sample, youtubePlayerPolicy.sampleMs);
    signal.addEventListener("abort", abort, { once: true });
    loadYouTubeAPI().then((api) => {
      if (settled) return;
      player = initProbePlayer(api, container.id, videoId, sample, abort);
    }).catch(abort);
  });
}
