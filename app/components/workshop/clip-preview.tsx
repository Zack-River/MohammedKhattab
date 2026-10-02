"use client";

import { firstEdit, editRhythms, type ClipStage } from "@/app/data/first-edit";
import { useState } from "react";
import MediaPlayer from "@/app/components/ui/media-player";
import { cn } from "@/app/lib/cn";
import { useFirstEdit } from "./first-edit-provider";

export default function ClipPreview({
  stage = "finished",
  compact = false,
}: {
  stage?: ClipStage;
  compact?: boolean;
}) {
  const { rhythm } = useFirstEdit();
  const edit = editRhythms[rhythm];
  const source = stage === "raw" ? firstEdit.raw : edit.source;
  const [active, setActive] = useState(false);
  const play = () => setActive(true);
  const caption = stage === "finished";
  return (
    <div
      data-clip-preview
      data-clip-stage={stage}
      data-clip-rhythm={rhythm}
      className="relative overflow-hidden rounded-xl border border-foreground/20 bg-canvas text-foreground"
    >
      <div
        className={cn(
          "relative aspect-video overflow-hidden",
          compact && "aspect-[4/3]",
        )}
      >
        {active ? (
          <MediaPlayer
            key={source}
            source={source}
            title={
              stage === "raw"
                ? "لقطة القهوة الأصلية"
                : `نسخة القهوة ${edit.label}`
            }
            poster={firstEdit.poster}
            compact={compact}
            overlay={
              caption ? (
                <div
                  data-clip-caption
                  className="pointer-events-none absolute inset-x-4 top-4"
                >
                  <span className="inline-block rounded-lg bg-canvas/85 px-3 py-2 text-sm font-bold sm:text-lg">
                    {edit.title}
                  </span>
                </div>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* A local, small poster keeps every chapter useful before media loads. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstEdit.poster}
              alt="نفس لقطة القهوة التي نحررها طوال الرحلة"
              width="720"
              height="406"
              loading="lazy"
              className={cn(
                "size-full object-cover",
                (stage === "color" || caption) && "clip-grade",
              )}
            />
            <button
              type="button"
              data-clip-play
              onClick={play}
              aria-label={
                stage === "raw"
                  ? "شغّل اللقطة الأصلية"
                  : `شغّل النسخة ${edit.label}`
              }
              className="group absolute inset-0 flex items-center justify-center bg-canvas/10 transition-colors hover:bg-canvas/25"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-brand shadow-card transition-transform motion-safe:group-hover:scale-110 motion-safe:group-active:scale-95">
                <span aria-hidden="true">▶</span>
              </span>
            </button>
          </>
        )}
        {caption && !active && (
          <div
            data-clip-caption
            className="pointer-events-none absolute inset-x-4 top-4"
          >
            <span className="inline-block rounded-lg bg-canvas/85 px-3 py-2 text-sm font-bold sm:text-lg">
              {edit.title}
            </span>
          </div>
        )}
        {!active && (
          <span
            className="pointer-events-none absolute start-3 bottom-3 rounded bg-canvas/85 px-2 py-1 text-xs"
            dir="ltr"
          >
            {stage === "raw"
              ? "0:08 / RAW"
              : `${edit.duration} / ${rhythm.toUpperCase()}`}
          </span>
        )}
      </div>
    </div>
  );
}
