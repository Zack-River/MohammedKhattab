import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { verifyCurrentPassword } from "./helpers/verify-password";
import { authPolicy } from "@platform/config/auth";
export function handlePassword(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const { client, user } = await requireIdentity(), input = await readJson(request);
    if (typeof input?.password !== "string" || input.password.length < authPolicy.passwordMin || input.password.length > authPolicy.passwordMax || input.password !== input.confirmPassword || input.password === input.currentPassword) throw new ApiError(400, "INVALID_INPUT");
    await verifyCurrentPassword(user.email ?? "", typeof input.currentPassword === "string" ? input.currentPassword : "", user.id);
    const { error } = await client.auth.updateUser({ password: input.password, current_password: typeof input.currentPassword === "string" ? input.currentPassword : undefined });
    if (error) throw new ApiError(error.status === 429 ? 429 : 400, error.status === 429 ? "RATE_LIMITED" : "AUTH_FAILED");
    return Response.json({ saved: true });
  });
}
