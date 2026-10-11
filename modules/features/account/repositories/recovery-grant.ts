import "server-only";
import type { DatabaseClient } from "@platform/types/database-client";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
export async function recoverySession(client: DatabaseClient) {
  const { data, error } = await client.auth.getClaims();
  const id = data?.claims.session_id;
  if (error || typeof id !== "string") throw new ApiError(403, "RECOVERY_EXPIRED");
  return id;
}
export async function authorizeRecovery(client: DatabaseClient, userId: string) {
  const sessionId = await recoverySession(client);
  const { error } = await createAuthAdministrator().from("account_recovery_grants").upsert({ user_id: userId, session_id: sessionId, expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() });
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
}
export async function consumeRecovery(client: DatabaseClient, userId: string) {
  const sessionId = await recoverySession(client);
  const { data, error } = await createAuthAdministrator().from("account_recovery_grants").delete().eq("user_id", userId).eq("session_id", sessionId).gt("expires_at", new Date().toISOString()).select("user_id").maybeSingle();
  if (error || !data) throw new ApiError(403, "RECOVERY_EXPIRED");
}
export async function hasRecoveryGrant(client: DatabaseClient, userId: string) {
  const sessionId = await recoverySession(client);
  const { data, error } = await createAuthAdministrator().from("account_recovery_grants").select("user_id").eq("user_id", userId).eq("session_id", sessionId).gt("expires_at", new Date().toISOString()).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return Boolean(data);
}
