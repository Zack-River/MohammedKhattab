import { requireAdmin } from "../identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { readAdminUser } from "./users";
import { suspensionPeriods, userAdministration } from "@platform/config/user-moderation";
import type { UserModeration } from "@platform/types/admin-users";
export async function moderateUser(id: string, change: UserModeration) {
  const { client, user: actor } = await requireAdmin();
  const target = await readAdminUser(id);
  if (target.admin || actor.id === id) throw new ApiError(403, "PROTECTED_ADMIN");
  if (change.action === "promote") {
    const result = await client.rpc("promote_admin_user", { target_id: id });
    if (result.error) throw new ApiError(result.error.code === "22023" ? 400 : 503, "INVALID_INPUT");
  } else {
    const administrator = createAuthAdministrator();
    const result = change.action === "remove" ? await administrator.auth.admin.deleteUser(id)
      : await administrator.auth.admin.updateUserById(id, { ban_duration: change.action === "restore" ? "none"
        : `${change.action === "ban" ? userAdministration.permanentBanHours : (change.action === "suspend" ? suspensionPeriods.find(item => item.id === change.period)!.hours : 0)}h` });
    if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  }
  return { saved: true };
}
