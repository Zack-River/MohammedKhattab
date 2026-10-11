import "server-only";
import { requireAdmin } from "@platform/features/admin/identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
export async function readUserContacts(id: string) {
  await requireAdmin();
  const { data, error } = await createAuthAdministrator().from("account_contacts").select("*").eq("user_id", id).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(404, "NOT_FOUND");
  return data;
}
