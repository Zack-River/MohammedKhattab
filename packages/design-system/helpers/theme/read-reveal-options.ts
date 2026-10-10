import { parseThemeTime } from "./parse-time";
import { parseThemeNumber } from "./parse-number";
import type { RevealOptions } from "../../types/interactions";

/** Resolve inherited theme tokens on the client; keep motion values in theme.css. */
export function readRevealOptions(root: HTMLElement): RevealOptions {
  const style = getComputedStyle(root);
  const token = (name: string) => style.getPropertyValue(name).trim();
  const number = (name: string) => parseThemeNumber(token(name), name);
  const milliseconds = (name: string) => parseThemeTime(token(name), name);
  const entrance = {
    y: number("--motion-reveal-distance"),
    duration: milliseconds("--motion-duration-reveal"),
  };
  return {
    viewportThreshold: number("--motion-reveal-viewport"),
    easing: token("--motion-easing"),
    groups: [
      {
        trigger: "[data-reveal-group=hero]",
        children: true,
        stagger: milliseconds("--motion-reveal-stagger"),
        ...entrance,
      },
      {
        trigger: "[data-reveal]:not([data-reveal-group=hero] > *)",
        ...entrance,
      },
    ],
  };
}
