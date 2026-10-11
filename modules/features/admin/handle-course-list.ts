import { apiResponse } from "@platform/lib/api/respond";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { ApiError } from "@platform/lib/api/error";
import { requireAdmin } from "./identity";
import { readCourseQuery } from "./helpers/read-course-query";
import { readCourseList } from "./repositories/course-list";
import { validateCourseCreate } from "./helpers/validate-course-create";
import { createCourse } from "./repositories/create-course";
export function handleCourseList(request: Request, create = false) {
 return apiResponse(async () => {
  await requireAdmin();
  if (!create) return Response.json(await readCourseList(readCourseQuery(new URL(request.url).searchParams)));
  if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const input = validateCourseCreate(await readJson(request));
  if (!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await createCourse(input), { status: 201 });
 });
}
