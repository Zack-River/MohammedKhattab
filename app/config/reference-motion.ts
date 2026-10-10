import palette from "../styles/theme-server.json";
const motion = palette.workshopMotion;
import type { RevealOptions } from "@khatab/design/types/interactions";
// Entrance groups and timings from the approved workshop's motion script.
export const referenceMotion = {
  viewportThreshold: motion.viewport,
  easing: motion.easing,
  groups: [
    {
      trigger: ".hero-headline",
      y: motion.distanceCard,
      duration: motion.durationMain,
      delay: motion.delayHeading,
      immediate: true,
    },
    {
      trigger: ".hero-support-text",
      y: motion.distanceText,
      duration: motion.durationMain,
      delay: motion.delaySupport,
      immediate: true,
    },
    {
      trigger: ".hero-video-shell",
      y: motion.distancePreview,
      scale: motion.scalePreview,
      duration: motion.durationMain,
      delay: motion.delayPreview,
      immediate: true,
    },
    {
      trigger: ".hero-cta-wrapper",
      y: motion.distanceAction,
      duration: motion.durationMain,
      delay: motion.delayAction,
      immediate: true,
    },
    {
      trigger:
        ".clients-header, .transform-header, .roadmap-header, .testimonials-header, .faq-header",
      children: true,
      y: motion.distanceText,
      duration: motion.durationHeading,
      stagger: motion.staggerHeading,
    },
    {
      trigger: ".clients-grid, .transform-stages-grid, .testimonials-grid",
      y: motion.distanceCard,
      duration: motion.durationCard,
    },
    {
      trigger: ".featured-review-card",
      y: motion.distanceText,
      scale: motion.scaleReview,
      duration: motion.durationCard,
    },
    {
      trigger: "#instructor",
      target: ".instructor-photo-column",
      x: motion.offsetPhoto,
      duration: motion.durationMain,
    },
    {
      trigger: "#instructor",
      target: ".instructor-copy-column",
      x: motion.offsetCopy,
      duration: motion.durationMain,
    },
    {
      trigger: "#guarantee",
      target: ".guarantee-card",
      y: motion.distancePanel,
      duration: motion.durationCard,
    },
    {
      trigger: ".faq-accordion",
      target: ".faq-item",
      y: motion.distanceText,
      duration: motion.durationFaq,
      stagger: motion.staggerFaq,
    },
    {
      trigger: "#enroll",
      target: ".final-cta-box",
      y: motion.distancePanel,
      duration: motion.durationCard,
    },
  ],
} as const satisfies RevealOptions;
