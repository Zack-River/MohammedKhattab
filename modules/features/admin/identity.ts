import "server-only";
import { requireIdentity, currentIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
export async function hasAdminAccess() {
  const identity = await currentIdentity();
  if (!identity) return false;
  const { data, error } = await identity.client.from("admin_users").select("user_id").eq("user_id", identity.user.id).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return Boolean(data);
}
export async function requireAdmin() {
  const identity = await requireIdentity();
  if (!await hasAdminAccess()) throw new ApiError(403, "FORBIDDEN");
  return identity;
}
