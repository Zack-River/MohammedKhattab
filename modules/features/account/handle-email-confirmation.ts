import { authPolicy } from "@platform/config/auth";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson, sameOrigin } from "@platform/lib/server-request";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { isValidEmail } from "@platform/helpers/validation/email";
import { applicationOrigin } from "@platform/lib/application-origin";
export function handleEmailConfirmation(request: Request) {
  return apiResponse(async () => {
    if (!sameOrigin(request)) throw new ApiError(403, "FORBIDDEN");
    const input = await readJson(request), client = await createDatabaseClient();
    if (typeof input?.email !== "string" || !isValidEmail(input.email, authPolicy.emailMax)) throw new ApiError(400, "INVALID_INPUT");
    if (input.type !== undefined && input.type !== "signup" && input.type !== "email_change") throw new ApiError(400, "INVALID_INPUT");
    const pending = input.type === "email_change";
    if (pending) {
      const { data } = await client.auth.getUser();
      if (!data.user || data.user.new_email !== input.email) throw new ApiError(403, "FORBIDDEN");
    }
    const { error } = await client.auth.resend({ type: pending ? "email_change" : "signup", email: input.email, options: { emailRedirectTo: `${applicationOrigin()}/api/auth/callback` } });
    if (error) throw new ApiError(error.status === 429 ? 429 : 503, error.status === 429 ? "RATE_LIMITED" : "AUTH_FAILED");
    return Response.json({ sent: true });
  });
}
