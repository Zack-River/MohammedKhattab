import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { isValidEmail } from "@platform/helpers/validation/email";
import { authPolicy } from "@platform/config/auth";
import { applicationOrigin } from "@platform/lib/application-origin";
import { consumeRecovery } from "./repositories/recovery-grant";
export function handleRecovery(request: Request, mode: "request" | "reset") {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const input = await readJson(request);
    if (mode === "request") {
      if (typeof input?.email !== "string" || !isValidEmail(input.email, authPolicy.emailMax)) throw new ApiError(400, "INVALID_INPUT");
      const client = await createDatabaseClient();
      const { error } = await client.auth.resetPasswordForEmail(input.email, { redirectTo: `${applicationOrigin()}/api/auth/callback` });
      if (error) throw new ApiError(error.status === 429 ? 429 : 503, error.status === 429 ? "RATE_LIMITED" : "AUTH_FAILED");
      return Response.json({ sent: true });
    }
    const { client, user } = await requireIdentity();
    if (typeof input?.password !== "string" || input.password.length < authPolicy.passwordMin || input.password.length > authPolicy.passwordMax || input.password !== input.confirmPassword) throw new ApiError(400, "INVALID_INPUT");
    await consumeRecovery(client, user.id);
    const { error } = await client.auth.updateUser({ password: input.password });
    if (error) throw new ApiError(400, "AUTH_FAILED");
    await client.auth.signOut({ scope: "global" });
    return Response.json({ saved: true });
  });
}
