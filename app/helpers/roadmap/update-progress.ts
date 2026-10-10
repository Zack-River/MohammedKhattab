import { clamp } from "@/app/lib/timeline";
import { readRoadmapGeometry } from "./read-geometry";
export function updateRoadmapProgress(timeline: HTMLElement, track: HTMLElement, progress: HTMLElement, options: { activation: number; endInset: number; milestoneOffset: number }) {
  const geometry = readRoadmapGeometry(timeline, options.endInset);
  if (!geometry) return;
  for (const line of [track, progress]) {
    line.style.top = `${geometry.top}px`;
    line.style.height = `${geometry.height}px`;
  }
  const filled = clamp((window.innerHeight * options.activation - geometry.start) / geometry.height);
  progress.style.transform = `scaleY(${filled})`;
  return filled <= 0 ? -1 : geometry.centers.reduce((active, center, index) =>
    (center - geometry.start) / geometry.height - options.milestoneOffset <= filled ? index : active, -1);
}
