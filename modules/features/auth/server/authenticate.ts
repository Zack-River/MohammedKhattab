import { applicationOrigin } from "@platform/lib/application-origin";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { ApiError } from "@platform/lib/api/error";
import { ensureProfile } from "@platform/features/profile/repositories/ensure-profile";
import { readProfile } from "@platform/features/profile/repositories/read-profile";
import type { AuthMode, AuthValues } from "@platform/types/auth";
export async function authenticate(values: AuthValues, mode: AuthMode) {
  const client = await createDatabaseClient();
  const result = mode === "login"
    ? await client.auth.signInWithPassword({ email: values.email, password: values.password })
    : await client.auth.signUp({ email: values.email, password: values.password, options: {
      data: { name: values.name }, emailRedirectTo: `${applicationOrigin()}/api/auth/callback`,
    } });
  if (result.error) {
    if (result.error.status === 429) throw new ApiError(429, "RATE_LIMITED");
    throw new ApiError(mode === "login" ? 401 : 400, mode === "login" ? "INVALID_CREDENTIALS" : "AUTH_FAILED");
  }
  if (!result.data.session || !result.data.user) return { status: "confirmation_required" as const };
  await ensureProfile(client, result.data.user);
  return { status: "authenticated" as const, profile: await readProfile(client, result.data.user) };
}
