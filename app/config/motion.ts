export const MEDIA_QUERIES = {
  reducedMotion: "(prefers-reduced-motion: reduce)",
  finePointer: "(hover: hover) and (pointer: fine)",
} as const;

export const motionSettings = {
  reveal: { easing: "cubic-bezier(0.16, 1, 0.3, 1)", viewportInset: "-8%" },
  editingStory: {
    preloadViewportRatio: 1,
    scrub: 0.35,
    roughRotation: -8,
    roughScale: 0.86,
    enterYPercent: 25,
    rotation: 180,
    duration: 1,
    start: "top 30%",
    end: "bottom 90%",
  },
  demo: { duration: 0.32, easing: [0.16, 1, 0.3, 1] },
  countUp: { durationMs: 1600, visibilityThreshold: 0.5 },
  timeline: {
    focalViewportRatio: 0.55,
    damping: 0.22,
    settledDelta: 0.001,
    resetThreshold: 0.005,
    firstMarkerThreshold: 0.01,
    markerLead: 0.02,
    precision: 4,
  },
} as const;

interface RevealProfile {
  distanceToken: `--${string}`;
  duration: number;
  axis?: "x" | "y";
  direction?: 1 | -1;
  delay?: number;
  scale?: number;
  stagger?: number;
  immediate?: boolean;
  children?: "group" | "individual";
}

// Components opt in through data-motion; styling classes are not animation APIs.
export const revealProfiles = {
  "hero-heading": {
    distanceToken: "--motion-reveal-large",
    duration: 0.85,
    delay: 0.05,
    immediate: true,
  },
  "hero-copy": {
    distanceToken: "--motion-reveal-medium",
    duration: 0.85,
    delay: 0.2,
    immediate: true,
  },
  "hero-video": {
    distanceToken: "--motion-reveal-video",
    duration: 0.85,
    delay: 0.35,
    scale: 0.97,
    immediate: true,
  },
  "hero-cta": {
    distanceToken: "--motion-reveal-small",
    duration: 0.85,
    delay: 0.48,
    immediate: true,
  },
  header: {
    distanceToken: "--motion-reveal-medium",
    duration: 0.7,
    stagger: 0.1,
    children: "group",
  },
  grid: {
    distanceToken: "--motion-reveal-large",
    duration: 0.7,
    stagger: 0.09,
    children: "individual",
  },
  "roadmap-day": { distanceToken: "--motion-reveal-large", duration: 0.65 },
  featured: { distanceToken: "--motion-reveal-medium", duration: 0.75 },
  card: { distanceToken: "--motion-reveal-extra", duration: 0.75 },
  "instructor-photo": {
    distanceToken: "--motion-instructor-travel",
    duration: 0.85,
    axis: "x",
  },
  "instructor-copy": {
    distanceToken: "--motion-instructor-travel",
    duration: 0.85,
    axis: "x",
    direction: -1,
  },
  faq: {
    distanceToken: "--motion-reveal-medium",
    duration: 0.5,
    children: "individual",
  },
} satisfies Record<string, RevealProfile>;

export function getRevealProfile(
  name: string | undefined,
): RevealProfile | undefined {
  if (!name || !Object.hasOwn(revealProfiles, name)) return undefined;
  return revealProfiles[name as keyof typeof revealProfiles];
}
