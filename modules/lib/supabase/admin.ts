import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@platform/types/database";
import { supabaseEnvironment } from "./environment";
import { ApiError } from "@platform/lib/api/error";
/** Never exports the secret or shares a cookie-bound authenticated client. */
export function createAuthAdministrator() {
  const { url } = supabaseEnvironment();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new ApiError(503, "SUPABASE_NOT_CONFIGURED");
  return createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
