import { motionSettings } from "@/app/config/motion";

export function getScrollProgress(
  scrollY: number,
  start: number,
  end: number,
): number {
  if (scrollY <= start) return 0;
  if (end <= start || scrollY >= end) return 1;
  return (scrollY - start) / (end - start);
}

export function getActiveTimelineIndex(
  progress: number,
  markers: readonly number[],
): number {
  const settings = motionSettings.timeline;
  if (progress <= settings.resetThreshold) return -1;

  let activeIndex = -1;
  markers.forEach((position, index) => {
    const threshold =
      index === 0
        ? settings.firstMarkerThreshold
        : position - settings.markerLead;
    if (progress >= threshold) activeIndex = index;
  });
  return activeIndex;
}
