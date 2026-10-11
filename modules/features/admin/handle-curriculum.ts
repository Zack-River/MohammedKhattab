import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "./identity";
import { validateCurriculumMutation } from "./helpers/validate-curriculum-mutation";
import { saveCurriculum } from "./repositories/save-curriculum";
export async function handleAdminCurriculum(slug: string, request: Request) {
  return apiResponse(async () => {
    await requireAdmin();
    if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
    const input = validateCurriculumMutation(await readJson(request));
    if (!input) throw new ApiError(400,"INVALID_INPUT");
    return Response.json(await saveCurriculum(slug,input));
  });
}
