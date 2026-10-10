"use client";
import { useEffect, type RefObject } from "react";

/** Release playback only after a visible player leaves the viewport. */
export function usePlayerViewportReset(
  ref: RefObject<HTMLElement | null>,
  reset: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;
    let wasVisible = false;
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio > 0;
      if (wasVisible && !visible && !element.contains(document.fullscreenElement))
        reset();
      wasVisible = visible;
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, reset, enabled]);
}
