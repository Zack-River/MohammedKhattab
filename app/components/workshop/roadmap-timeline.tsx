"use client";

import { useRef, type JSX } from "react";
import type { RoadmapDayData } from "@/app/types/workshop";
import { useRoadmapProgress } from "@/app/hooks/use-roadmap-progress";
import RoadmapDay from "./roadmap-day";

export default function RoadmapTimeline({
  days,
}: {
  days: readonly RoadmapDayData[];
}): JSX.Element {
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeIndex = useRoadmapProgress(timelineRef, days);
  return (
    <div
      className="relative mx-auto flex max-w-content flex-col gap-6 text-start sm:gap-12"
      ref={timelineRef}
    >
      <div
        className="pointer-events-none absolute start-2.5 z-0 w-0.5 bg-paper-line md:start-[calc(var(--spacing-timeline-marker)/2)]"
        data-timeline-track
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute start-2.5 z-0 w-0.5 origin-top bg-linear-to-b from-brand to-brand-soft md:start-[calc(var(--spacing-timeline-marker)/2)]"
        data-timeline-progress
        aria-hidden="true"
      />
      {days.map((day, index) => (
        <RoadmapDay
          key={day.number}
          {...day}
          status={
            activeIndex === index
              ? "active"
              : activeIndex > index
                ? "passed"
                : "pending"
          }
        />
      ))}
    </div>
  );
}
