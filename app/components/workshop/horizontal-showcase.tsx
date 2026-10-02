"use client";

import { useId, useRef, type ReactNode } from "react";
import { useHorizontalShowcase } from "@/app/hooks/use-horizontal-showcase";

export default function HorizontalShowcase({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportId = useId();
  const titleId = useId();
  const { index, goTo } = useHorizontalShowcase(rootRef, count);
  const controlClass =
    "flex size-11 items-center justify-center rounded-full border border-line-strong bg-panel text-xl transition-[background-color,scale] hover:bg-brand motion-safe:active:scale-95 motion-reduce:transition-none disabled:cursor-default disabled:opacity-30 disabled:hover:bg-panel";
  return (
    <div ref={rootRef} data-showcase className="relative py-4 text-start">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm text-muted">المهارة دي ليها أكتر من شكل</p>
          <h3 id={titleId} className="text-2xl font-bold">
            واختار الشكل اللي يشبهك.
          </h3>
        </div>
        <span className="text-xs text-muted">اسحب وشوف الأنواع ←</span>
      </div>
      <div
        id={viewportId}
        data-showcase-viewport
        dir="ltr"
        role="region"
        aria-labelledby={titleId}
        tabIndex={0}
        className="overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory rounded-2xl motion-reduce:scroll-auto"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          goTo(index + (event.key === "ArrowRight" ? 1 : -1));
        }}
      >
        <div data-showcase-track className="relative flex w-max gap-6 p-2">
          {children}
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div dir="ltr" className="flex gap-2">
            <button
              type="button"
              aria-label="السابق"
              aria-controls={viewportId}
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className={controlClass}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="التالي"
              aria-controls={viewportId}
              disabled={index === count - 1}
              onClick={() => goTo(index + 1)}
              className={controlClass}
            >
              →
            </button>
          </div>
          <span
            dir="ltr"
            className="text-sm text-muted tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {index + 1} / {count}
          </span>
        </div>
        <p className="text-sm text-copy">اسحب أو استخدم الأسهم</p>
        <a
          href="#roadmap"
          className="text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-soft"
        >
          كمّل لخطة التعلم ↓
        </a>
      </div>
    </div>
  );
}
