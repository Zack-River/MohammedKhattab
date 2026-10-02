import { MEDIA_QUERIES } from "@/app/config/motion";
import { useMediaQuery } from "./use-media-query";

export function useReducedMotion(): boolean {
  return useMediaQuery(MEDIA_QUERIES.reducedMotion);
}
