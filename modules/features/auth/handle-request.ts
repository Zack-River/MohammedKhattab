import { readJson, sameOrigin } from "@platform/lib/server-request";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { authCopy } from "@platform/data/auth";
import type { AuthMode } from "@platform/types/auth";
import { validateAuth } from "./helpers/validate";
import { authenticate } from "./server/authenticate";
export async function handleAuth(request: Request, mode: AuthMode) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const result = validateAuth(await readJson(request), mode);
    if (!result.valid) return Response.json({ error: authCopy.invalidRequest, fields: result.errors }, { status: 400 });
    return Response.json(await authenticate(result.values, mode));
  });
}
