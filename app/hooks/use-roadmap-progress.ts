import { useEffect, useState, type RefObject } from "react";
import { createFrameScheduler } from "@khatab/design/helpers/browser/animation-frame";
import { updateRoadmapProgress } from "@/app/helpers/roadmap/update-progress";
import { readRoadmapOptions } from "@/app/helpers/roadmap/read-options";
export function useRoadmapProgress(ref: RefObject<HTMLDivElement | null>, itemCount: number) {
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeline = ref.current;
    const track = timeline?.querySelector<HTMLElement>(".timeline-track");
    const progress = timeline?.querySelector<HTMLElement>(".timeline-progress");
    if (!timeline || !itemCount || !track || !progress) return;
    const options = readRoadmapOptions();
    const { schedule, dispose } = createFrameScheduler(() => {
      const index = updateRoadmapProgress(timeline, track, progress, options);
      if (index !== undefined) setActiveIndex((previous) => previous === index ? previous : index);
    });
    const observer = new ResizeObserver(schedule);
    observer.observe(timeline);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      dispose();
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ref, itemCount]);
  return activeIndex;
}
