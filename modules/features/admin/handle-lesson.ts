import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "./identity";
import { validMediaUrl } from "./helpers/validate-media-url";
export async function handleAdminLesson(slug: string, id: string, request: Request) {
  return apiResponse(async () => {
    const { client } = await requireAdmin();
    if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
    const body = await readJson(request);
    if (!validMediaUrl(body?.videoUrl) || !body.videoUrl) throw new ApiError(400,"INVALID_INPUT");
    const { data, error } = await client.from("lessons").update({ video_url: body.videoUrl }).eq("course_slug",slug).eq("id",id).select("id").maybeSingle();
    if (error) throw new ApiError(503,"INTERNAL_ERROR");
    if (!data) throw new ApiError(404,"NOT_FOUND");
    return Response.json({ saved: true });
  });
}
