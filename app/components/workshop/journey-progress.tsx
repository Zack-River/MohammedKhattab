import type { RefObject } from "react";
import { journeyChapters } from "@/app/data/journey";
import { useJourneyProgress } from "@/app/hooks/use-journey-progress";

export default function JourneyProgress({
  rootRef,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
}) {
  const index = useJourneyProgress(rootRef);
  const chapter = journeyChapters[index];
  const next = journeyChapters[Math.min(index + 1, journeyChapters.length - 1)];
  return (
    <>
      <div
        className="reading-progress pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 origin-right bg-brand"
        aria-hidden="true"
      />
      <nav
        data-journey-progress
        className="fixed end-4 bottom-4 z-40 hidden items-center gap-4 rounded-full border border-line-strong bg-canvas px-5 py-3 text-xs shadow-card lg:flex"
        aria-label="رحلتك في الصفحة"
      >
        <span className="text-brand tabular-nums" dir="ltr">
          {chapter.number} / {String(journeyChapters.length).padStart(2, "0")}
        </span>
        <a href={`#${chapter.id}`} aria-current="step" className="text-copy">
          {chapter.title}
        </a>
        <span className="h-4 w-px bg-line-strong" aria-hidden="true" />
        <a
          href={`#${next.id}`}
          className="text-foreground hover:text-brand-soft"
        >
          {index === journeyChapters.length - 1
            ? "وصلت للنهاية ✓"
            : "اللي بعده ↓"}
        </a>
      </nav>
    </>
  );
}
