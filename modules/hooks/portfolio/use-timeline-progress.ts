"use client";
import { createFrameScheduler } from "@khatab/design/helpers/browser/animation-frame";
import { updatePortfolioTimeline } from "@platform/helpers/portfolio/update-timeline";
import { useEffect, type RefObject } from "react";
/** One frame per scroll batch; mutate decorative geometry without React renders. */
export function useTimelineProgress(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => updatePortfolioTimeline(root, preference.matches);
    const { schedule, dispose } = createFrameScheduler(update);
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    preference.addEventListener("change", schedule);
    return () => {
      dispose();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      preference.removeEventListener("change", schedule);
    };
  }, [ref]);
}
