import "server-only";
import { requireAdmin } from "../identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { userAdministration } from "@platform/config/user-moderation";
import { adminUserRecord } from "../helpers/admin-user-record";
export async function readAdminUsers(page = 1) {
  await requireAdmin();
  const client = createAuthAdministrator();
  const result = await client.auth.admin.listUsers({ page, perPage: userAdministration.pageSize });
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  const users = result.data.users, ids = users.map(user => user.id);
  if (!ids.length) return { users: [], page, hasNext: false };
  const [profiles, roles] = await Promise.all([
    client.from("profiles").select("*").in("id", ids), client.from("admin_users").select("user_id").in("user_id", ids),
  ]);
  if (profiles.error || roles.error) throw new ApiError(503, "INTERNAL_ERROR");
  return { users: users.map(user => adminUserRecord(user, profiles.data.find(row => row.id === user.id), roles.data.some(row => row.user_id === user.id))),
    page, hasNext: Boolean(result.data.nextPage) };
}
export async function readAdminUser(id: string) {
  await requireAdmin();
  const client = createAuthAdministrator();
  const [identity, profile, role] = await Promise.all([
    client.auth.admin.getUserById(id), client.from("profiles").select("*").eq("id", id).maybeSingle(),
    client.from("admin_users").select("user_id").eq("user_id", id).maybeSingle(),
  ]);
  if (identity.error?.status === 404 || !identity.data.user) throw new ApiError(404, "NOT_FOUND");
  if (identity.error || profile.error || role.error) throw new ApiError(503, "INTERNAL_ERROR");
  return adminUserRecord(identity.data.user, profile.data ?? undefined, Boolean(role.data));
}
