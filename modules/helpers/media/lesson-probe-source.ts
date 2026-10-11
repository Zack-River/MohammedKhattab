import { driveFileId } from "./drive-file-id";
import { validMediaUrl } from "@platform/features/admin/helpers/validate-media-url";
import { endpoints } from "@platform/config/navigation";
export function lessonProbeSource(slug: string, value: string) {
  const url = value.trim();
  if (!url || !validMediaUrl(url)) return null;
  if (driveFileId(url)) return endpoints.adminMediaStream(slug,url);
  if (/^https:\/\/drive\.google\.com(?:\/|$)/i.test(url)) return null;
  return url;
}
