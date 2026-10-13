export const categories = [
  { id: "all", label: "كل الدورات" },
  { id: "editing", label: "مونتاج الفيديو" },
  { id: "motion", label: "موشن جرافيك" },
  { id: "design", label: "تصميم جرافيك" },
  { id: "business", label: "العمل الحر" },
] as const;
export type Category = (typeof categories)[number]["id"];
export const artworkKinds = [
  "timeline",
  "motion",
  "design",
  "business",
] as const;
export type ArtworkKind = (typeof artworkKinds)[number];

/** Original seed media is for preview/testing, not a sellable course lesson. */
export const sampleLessonVideoId = "BQTI8hXPVD0";
export const sampleLessonVideoUrl = `https://www.youtube-nocookie.com/embed/${sampleLessonVideoId}`;
