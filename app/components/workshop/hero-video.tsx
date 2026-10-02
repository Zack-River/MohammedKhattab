"use client";

import type { JSX } from "react";
import MediaPlayer from "@/app/components/ui/media-player";
import { useVideoEmbed } from "@/app/hooks/use-video-embed";

export default function HeroVideo({
  videoUrl,
}: {
  videoUrl: string;
}): JSX.Element {
  const { embedUrl, play } = useVideoEmbed(videoUrl);

  return (
    <div className="mx-auto w-full max-w-content self-center">
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-brand/35 bg-panel shadow-card"
        data-motion="hero-video"
      >
        {embedUrl ? (
          <MediaPlayer
            source={embedUrl}
            provider="youtube"
            title="فيديو من قناة محمد خطاب"
          />
        ) : (
          <button
            data-video-play
            type="button"
            className="video-poster group absolute inset-0 flex size-full flex-col items-center justify-center gap-3 p-4 text-center transition-colors sm:gap-4"
            aria-label="تشغيل فيديو من قناة محمد خطاب"
            onClick={play}
          >
            <span
              className="flex size-12 items-center justify-center rounded-full bg-brand text-foreground shadow-brand transition-[scale,background-color,box-shadow] duration-200 motion-safe:group-hover:scale-110 group-hover:shadow-glow motion-safe:group-active:scale-95 motion-safe:group-focus-visible:scale-110 motion-reduce:scale-none motion-reduce:transition-none sm:size-16 [&_svg]:size-6 [&_svg]:fill-current"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-xs font-bold sm:text-base">
              شاهد أسلوب محمد في المونتاج على يوتيوب
            </span>
            <span className="text-xs text-muted">
              اضغط للتشغيل • من قناة محمد خطاب
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
