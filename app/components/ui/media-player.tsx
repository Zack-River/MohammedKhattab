"use client";

import type { ReactNode } from "react";
import {
  useMediaPlayer,
  type MediaProvider,
} from "@/app/hooks/use-media-player";

export default function MediaPlayer({
  source,
  provider = "html5",
  title,
  poster,
  compact = false,
  overlay,
}: {
  source: string;
  provider?: MediaProvider;
  title: string;
  poster?: string;
  compact?: boolean;
  overlay?: ReactNode;
}) {
  const { hostRef, shellRef, status, retry } = useMediaPlayer({
    source,
    provider,
    title,
    poster,
    ratio: compact ? "4:3" : "16:9",
  });
  return (
    <div
      ref={shellRef}
      data-media-player
      data-provider={provider}
      data-player-status={status}
      className="media-player relative size-full bg-canvas"
      aria-label={title}
    >
      <div ref={hostRef} className="size-full" dir="ltr" />
      {overlay}
      {status === "loading" && (
        <p
          className="pointer-events-none absolute inset-x-0 top-0 bg-canvas/80 p-2 text-center text-xs text-copy"
          role="status"
        >
          بنجهّز الفيديو…
        </p>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-canvas/95 p-5 text-center">
          <p role="alert" className="text-sm text-copy">
            الفيديو مش متاح دلوقتي. جرّب تاني وتأكد من اتصالك.
          </p>
          <button
            type="button"
            onClick={retry}
            className="min-h-11 rounded-lg bg-brand px-5 py-2 font-semibold"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
    </div>
  );
}
