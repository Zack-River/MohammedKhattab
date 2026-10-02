import { useEffect, useRef, useState, type RefObject } from "react";

import { readLengthToken } from "../lib/design-tokens";
import { motionSettings } from "../config/motion";

import { getScrollProgress, getActiveTimelineIndex } from "../lib/timeline";
import type { RoadmapDayData } from "../types/workshop";

import { useReducedMotion } from "./use-reduced-motion";

export function useRoadmapProgress(
  timelineRef: RefObject<HTMLDivElement | null>,
  items: readonly RoadmapDayData[],
): number {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    const days = Array.from(
      timeline.querySelectorAll<HTMLElement>("[data-timeline-day]"),
    );
    const track = timeline.querySelector<HTMLElement>("[data-timeline-track]");
    const progressLine = timeline.querySelector<HTMLElement>(
      "[data-timeline-progress]",
    );
    const firstBadge = days[0]?.querySelector<HTMLElement>(
      "[data-timeline-marker]",
    );
    const lastCard = days
      .at(-1)
      ?.querySelector<HTMLElement>("[data-timeline-card]");

    if (!track || !progressLine || !firstBadge || !lastCard) {
      return;
    }

    const observerBuffer = readLengthToken("--observer-buffer");
    const endInset = readLengthToken("--timeline-end-inset");
    let markerPositions: number[] = [];
    let startScrollY = 0;
    let endScrollY = 0;
    let currentProgress = 0;
    let isIntersecting = false;
    let animationFrame = 0;

    const measureGeometry = () => {
      const timelineTop = timeline.getBoundingClientRect().top + window.scrollY;
      const firstRect = firstBadge.getBoundingClientRect();
      const firstCenter = firstRect.top + window.scrollY + firstRect.height / 2;
      const cardBottom =
        lastCard.getBoundingClientRect().bottom + window.scrollY;
      const lineEnd = cardBottom - endInset;
      const topOffset = firstCenter - timelineTop;
      const totalSpan = Math.max(0, lineEnd - firstCenter);

      markerPositions = days.map((day, index) => {
        const badge = day.querySelector<HTMLElement>("[data-timeline-marker]");
        if (!badge) return index / Math.max(1, days.length - 1);
        const rect = badge.getBoundingClientRect();
        const center = rect.top + window.scrollY + rect.height / 2;
        return totalSpan > 0
          ? Math.max(0, Math.min(1, (center - firstCenter) / totalSpan))
          : index / Math.max(1, days.length - 1);
      });

      // Finish all layout reads before writing track dimensions.
      track.style.top = `${topOffset}px`;
      track.style.height = `${totalSpan}px`;
      progressLine.style.top = `${topOffset}px`;
      progressLine.style.height = `${totalSpan}px`;

      const focalOffset =
        window.innerHeight * motionSettings.timeline.focalViewportRatio;
      startScrollY = firstCenter - focalOffset;
      endScrollY = lineEnd - focalOffset;
    };

    const renderProgress = () => {
      animationFrame = 0;
      if (!isIntersecting) return;

      const targetProgress = getScrollProgress(
        window.scrollY,
        startScrollY,
        endScrollY,
      );
      const difference = targetProgress - currentProgress;
      currentProgress =
        prefersReducedMotion ||
        Math.abs(difference) < motionSettings.timeline.settledDelta
          ? targetProgress
          : currentProgress + difference * motionSettings.timeline.damping;

      progressLine.style.transform = `scaleY(${currentProgress.toFixed(motionSettings.timeline.precision)})`;

      const nextActiveIndex = getActiveTimelineIndex(
        currentProgress,
        markerPositions,
      );
      if (activeIndexRef.current !== nextActiveIndex) {
        activeIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }

      if (
        Math.abs(targetProgress - currentProgress) >=
        motionSettings.timeline.settledDelta
      ) {
        animationFrame = window.requestAnimationFrame(renderProgress);
      }
    };

    const scheduleRender = () => {
      if (isIntersecting && animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(renderProgress);
      }
    };

    const onScroll = () => scheduleRender();
    const onResize = () => {
      measureGeometry();
      scheduleRender();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          measureGeometry();
          scheduleRender();
        } else if (window.scrollY < startScrollY) {
          currentProgress = 0;
          progressLine.style.transform = "scaleY(0)";
          activeIndexRef.current = -1;
          setActiveIndex(-1);
        }
      },
      { rootMargin: `${observerBuffer}px 0px ${observerBuffer}px 0px` },
    );

    progressLine.style.transform = "scaleY(0)";
    measureGeometry();
    observer.observe(timeline);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(timeline);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [timelineRef, items, prefersReducedMotion]);

  return activeIndex;
}
