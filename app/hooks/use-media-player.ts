import { useEffect, useRef, useState } from "react";
import type Plyr from "plyr";
import { playerSettings } from "@/app/config/player";
import { getYouTubeEmbedUrl } from "@/app/lib/video";

export type MediaProvider = "html5" | "youtube";
export function useMediaPlayer({
  source,
  provider,
  title,
  poster,
  ratio,
}: {
  source: string;
  provider: MediaProvider;
  title: string;
  poster?: string;
  ratio: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let instance: Plyr | undefined;
    let observer: IntersectionObserver | undefined;
    const fail = () => {
      if (!disposed) setStatus("error");
    };
    const timeout = window.setTimeout(
      fail,
      playerSettings.initializationTimeoutMs,
    );
    void import("plyr")
      .then(({ default: Player }) => {
        if (disposed) return;
        host.replaceChildren();
        let target: HTMLElement;
        if (provider === "html5") {
          const video = document.createElement("video");
          video.src = source;
          video.preload = "none";
          video.playsInline = true;
          video.controls = false;
          video.setAttribute("controlslist", "nodownload");
          video.setAttribute("aria-label", title);
          video.setAttribute("data-clip-video", "");
          if (poster) video.poster = poster;
          target = video;
        } else {
          const safeUrl = getYouTubeEmbedUrl(source);
          if (!safeUrl) throw new Error("Unsupported video URL");
          const url = new URL(safeUrl);
          url.searchParams.set("enablejsapi", "1");
          url.searchParams.set("origin", location.origin);
          url.searchParams.set("controls", "0");
          url.searchParams.set("playsinline", "1");
          const wrapper = document.createElement("div");
          wrapper.className = "plyr__video-embed";
          const frame = document.createElement("iframe");
          frame.src = url.toString();
          frame.title = title;
          frame.allow =
            "autoplay; encrypted-media; fullscreen; picture-in-picture";
          frame.allowFullscreen = true;
          frame.referrerPolicy = "strict-origin-when-cross-origin";
          frame.setAttribute("data-hero-video", "");
          wrapper.append(frame);
          target = wrapper;
        }
        host.append(target);
        // Plyr's runtime supports title; its bundled Options type omits it.
        const options: Plyr.Options & { title: string } = {
          ...playerSettings.options,
          title,
          ratio,
          fullscreen: {
            ...playerSettings.options.fullscreen,
            container: ".media-player",
          },
        };
        instance = new Player(target, options);
        instance.on("ready", () => {
          if (disposed) return;
          clearTimeout(timeout);
          host.querySelector("iframe")?.setAttribute("data-hero-video", "");
          setStatus("ready");
          void instance?.play()?.catch(() => {
            /* Browsers may require a second gesture after an async load. */
          });
        });
        instance.on("error", fail);
        observer = new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) instance?.pause();
        });
        observer.observe(host);
      })
      .catch(fail);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      observer?.disconnect();
      instance?.pause();
      instance?.destroy();
      host.replaceChildren();
    };
  }, [source, provider, title, poster, ratio, attempt]);
  const retry = () => {
    setStatus("loading");
    setAttempt((value) => value + 1);
  };
  return { hostRef, shellRef, status, retry };
}
