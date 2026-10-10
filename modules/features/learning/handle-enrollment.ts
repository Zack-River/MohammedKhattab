import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { readState } from "./repositories/read-state";
import { enrollCourse } from "./repositories/enroll-course";
export async function handleEnrollment(request?: Request) {
  return apiResponse(async () => {
    if (!request) {
      const { client, user } = await requireIdentity();
      return Response.json(await readState(client, user));
    }
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const body = await readJson(request);
    if (typeof body?.courseSlug !== "string") throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await enrollCourse(body.courseSlug));
  });
}
