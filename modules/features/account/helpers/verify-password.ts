import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnvironment } from "@platform/lib/supabase/environment";
import { ApiError } from "@platform/lib/api/error";
/** Reauthentication uses an isolated client and never replaces the active browser session. */
export async function verifyCurrentPassword(email: string, password: string, userId: string) {
  if (!password || password.length > 128) throw new ApiError(400, "CURRENT_PASSWORD_REQUIRED");
  const { url, key } = supabaseEnvironment();
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error || data.user?.id !== userId) throw new ApiError(error?.status === 429 ? 429 : 400, error?.status === 429 ? "RATE_LIMITED" : "CURRENT_PASSWORD_INVALID");
  const signout = await client.auth.signOut({ scope: "local" });
  if (signout.error) throw new ApiError(503, "INTERNAL_ERROR");
}
