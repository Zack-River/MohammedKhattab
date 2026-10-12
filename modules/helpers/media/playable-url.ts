import { driveFileId } from "./drive-file-id";
import { endpoints } from "@platform/config/navigation";
import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
export function playableUrl(value: string, slug: string, lessonId?: string) {
  const youtube = getYouTubeEmbedUrl(value.trim());
  if (youtube) return youtube;
  if (!driveFileId(value)) return value;
  return lessonId ? endpoints.lessonStream(slug,lessonId) : endpoints.introStream(slug);
}
