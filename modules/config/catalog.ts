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
