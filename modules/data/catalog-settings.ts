export const catalogSettings = {
  previewCourseId: "editing-foundations",
  previewLessonIds: ["editor-mindset", "your-workspace"],
  showcaseIds: ["editing-foundations", "motion-essentials", "visual-design"],
  showcaseLimit: 3,
  recommendationIds: [
    "editing-foundations",
    "motion-essentials",
    "visual-design",
    "first-client",
    "editing-workflow",
    "sound-design",
  ],
  recommendationLimit: 2,
} as const;
export const lessonResources: Record<string, readonly string[]> = {
  "editing-foundations/first-cut": ["project-checklist", "creative-brief"],
  "editing-foundations/editor-mindset": ["creative-brief"],
  "first-client/portfolio": ["portfolio-plan"],
};
