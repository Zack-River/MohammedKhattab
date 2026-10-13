import { apiResponse } from "@platform/lib/api/respond";
import { sameOrigin, readJson } from "@platform/lib/server-request";
import { ApiError } from "@platform/lib/api/error";
import { requireAdmin } from "./identity";
export function handleCourseDelete(slug: string, request: Request) {
 return apiResponse(async () => {
  if (!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const { client } = await requireAdmin(), input = await readJson(request);
  if (input?.confirmSlug !== slug) throw new ApiError(400,"INVALID_INPUT");
  const { error } = await client.rpc("delete_admin_course", { p_slug: slug });
  if (error?.message.includes("certificates_course_slug_fkey")) throw new ApiError(409,"COURSE_HAS_CERTIFICATES");
  if (error?.code === "23503") throw new ApiError(409,"COURSE_HAS_COMMERCE");
  if (error?.message.includes("COURSE_HAS_PAYMENTS")) throw new ApiError(409,"COURSE_HAS_PAYMENTS");
  if (error) throw new ApiError(error.message.includes("COURSE_HAS_STUDENTS") ? 409 : error.code === "P0002" ? 404 : 503, error.message.includes("COURSE_HAS_STUDENTS") ? "COURSE_HAS_STUDENTS" : error.code === "P0002" ? "NOT_FOUND" : "INTERNAL_ERROR");
  return Response.json({ deleted: true });
 });
}
