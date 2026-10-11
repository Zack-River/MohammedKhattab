import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { requireAdmin } from "./identity";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { streamDrive } from "@platform/features/catalog/stream-drive";
import { adminCoursePolicy } from "@platform/config/admin";
export function handleAdminMediaStream(slug: string, request: Request) {
  return apiResponse(async () => {
    const { client } = await requireAdmin();
    const url = new URL(request.url).searchParams.get("url") ?? "";
    if (url.length > adminCoursePolicy.urlMax || !driveFileId(url)) throw new ApiError(400,"INVALID_INPUT");
    const course = await client.from("courses").select("slug").eq("slug",slug).maybeSingle();
    if (course.error) throw new ApiError(503,"INTERNAL_ERROR");
    if (!course.data) throw new ApiError(404,"NOT_FOUND");
    return streamDrive(url, request);
  });
}
