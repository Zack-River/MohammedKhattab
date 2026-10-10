"use client";

import { useRef } from "react";
import type { RoadmapDayData } from "@khatab/design/types/workshop";
import { useRoadmapProgress } from "@/app/hooks/use-roadmap-progress";
import RoadmapDay from "./roadmap-day";

export default function RoadmapTimeline({
  days,
}: {
  days: readonly RoadmapDayData[];
}) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const activeIndex = useRoadmapProgress(timelineRef, days.length);
  return (
    <div className="roadmap-timeline" ref={timelineRef}>
      <div className="timeline-track" aria-hidden="true" />
      <div className="timeline-progress" aria-hidden="true" />
      {days.map((day, index) => (
        <RoadmapDay
          key={day.number}
          day={day}
          status={
            index === activeIndex
              ? "active"
              : index < activeIndex
                ? "passed"
                : "pending"
          }
        />
      ))}
    </div>
  );
}
