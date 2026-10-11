import "server-only";
import { requireAdmin } from "../identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { userAdministration } from "@platform/config/user-moderation";
import { adminUserRecord } from "../helpers/admin-user-record";
import type { AdminUserQuery } from "@platform/types/admin-users";
import { readUserResults } from "../helpers/read-user-results";
export async function readAdminUsers(query: AdminUserQuery) {
  const { client } = await requireAdmin();
  const result = await client.rpc("search_admin_users", { p_page: query.page, p_limit: userAdministration.pageSize,
    p_search: query.search, p_statuses: query.statuses, p_admins_only: query.adminsOnly,
    ...(query.newcomers ? { p_new_since: new Date(Date.now() - userAdministration.newcomerDays * 86400000).toISOString() } : {}) });
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  return readUserResults(result.data);
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
