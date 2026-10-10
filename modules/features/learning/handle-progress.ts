import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { saveProgress } from "./repositories/save-progress";
export async function handleProgress(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const body = await readJson(request);
    if (typeof body?.courseSlug !== "string" || typeof body.lessonId !== "string" || typeof body.completed !== "boolean") throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await saveProgress(body.courseSlug, body.lessonId, body.completed));
  });
}
