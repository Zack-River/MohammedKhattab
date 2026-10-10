import type { ComponentPropsWithoutRef } from "react";
import type { IconName } from "../types/ui";

const paths = {
  arrow: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
  sparkle: "M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z",
  shield:
    "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z",
  play: "M8 5v14l11-7z",
} as const;

export default function Icon({
  name,
  ...props
}: { name: IconName } & ComponentPropsWithoutRef<"svg">) {
  if (name === "menu")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        aria-hidden="true"
        {...props}
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    );
  if (name === "chevron")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
        {...props}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  if (name === "reel-play")
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        {...props}
      >
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  );
}
