import { driveFileId } from "./drive-file-id";
import { endpoints } from "@platform/config/navigation";
export function playableUrl(value: string, slug: string, lessonId?: string) {
  if (!driveFileId(value)) return value;
  return lessonId ? endpoints.lessonStream(slug,lessonId) : endpoints.introStream(slug);
}
