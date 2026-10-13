import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import { endpoints } from "@platform/config/navigation";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { validMediaUrl } from "./validate-media-url";
/** Draft Drive videos use the admin-only proxy, never the published lesson stream. */
export function adminPreviewVideoUrl(value: string, slug?: string) {
  const url = value.trim();
  if (!url || !validMediaUrl(url)) return "";
  const youtube = getYouTubeEmbedUrl(url);
  if (youtube) return youtube;
  if (driveFileId(url)) return slug ? endpoints.adminMediaStream(slug, url) : "";
  return url;
}
