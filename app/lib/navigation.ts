import type { MouseEvent } from "react";

import { MEDIA_QUERIES } from "../config/motion";

export function scrollToPageTop(event: MouseEvent<HTMLAnchorElement>): void {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  const prefersReducedMotion = window.matchMedia(
    MEDIA_QUERIES.reducedMotion,
  ).matches;
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}
