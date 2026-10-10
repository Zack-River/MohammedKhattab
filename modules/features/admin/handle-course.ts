import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "./identity";
import { readAdminCourses } from "./repositories/courses";
import { saveCourse } from "./repositories/save-course";
import { validateCourseEdit } from "./helpers/validate-course-edit";
export async function handleAdminCourse(slug: string, request?: Request) {
  return apiResponse(async () => {
    await requireAdmin();
    if (!request) { const record = (await readAdminCourses(slug))[0]; if (!record) throw new ApiError(404,"NOT_FOUND"); return Response.json(record); }
    if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
    const values = validateCourseEdit(await readJson(request));
    if (!values) throw new ApiError(400,"INVALID_INPUT");
    return Response.json(await saveCourse(slug,values));
  });
}
