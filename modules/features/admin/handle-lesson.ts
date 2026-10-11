import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "./identity";
import { readAdminCourses } from "./repositories/courses";
import { persistCurriculum } from "./repositories/persist-curriculum";
import { validMediaUrl } from "./helpers/validate-media-url";
export async function handleAdminLesson(slug: string, id: string, request: Request) {
  return apiResponse(async () => {
    await requireAdmin();
    if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
    const body = await readJson(request);
    if (!validMediaUrl(body?.videoUrl) || !body.videoUrl) throw new ApiError(400,"INVALID_INPUT");
    const record = (await readAdminCourses(slug))[0];
    const lesson = record?.course.modules.flatMap(chapter => chapter.lessons).find(lesson => lesson.id === id);
    if (!record || !lesson) throw new ApiError(404,"NOT_FOUND");
    await persistCurriculum(slug,record.revision,record.course.modules,{ id, video_url: body.videoUrl, preview: lesson.preview ?? false });
    return Response.json({ saved: true });
  });
}
