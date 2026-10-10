import type { RevealGroup } from "../../types/interactions";
export function createEntrance(target: Element, group: RevealGroup, index: number, easing: string) {
  const animation = target.animate([
    { opacity: 0, transform: `translate3d(${group.x ?? 0}px,${group.y ?? 0}px,0) scale(${group.scale ?? 1})` },
    { opacity: 1, transform: "none" },
  ], { duration: group.duration, delay: (group.delay ?? 0) + index * (group.stagger ?? 0), easing, fill: "both" });
  animation.pause();
  return animation;
}
