import { sampleLessonVideoUrl } from "@platform/config/catalog";
import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
export function isSampleLessonVideo(url: string) {
  return getYouTubeEmbedUrl(url) === getYouTubeEmbedUrl(sampleLessonVideoUrl);
}
