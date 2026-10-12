import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { createCheckout } from "./repositories/create-checkout";
export function handleCheckout(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const body = await readJson(request);
    if (
      !body ||
      typeof body.courseSlug !== "string" ||
      body.courseSlug.length > 100 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.courseSlug) ||
      Object.keys(body).some((key) => key !== "courseSlug")
    )
      throw new ApiError(400, "INVALID_INPUT");
    return Response.json(await createCheckout(body.courseSlug));
  });
}
