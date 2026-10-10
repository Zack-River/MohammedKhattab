import { artworkKinds } from "@platform/config/catalog";
import type { Course } from "@platform/types/lms";
export function validateArtworkKind(kind: Course["artwork"]) {
  if (!artworkKinds.includes(kind)) throw new Error(`Unsupported artwork variant: ${kind}`);
}
