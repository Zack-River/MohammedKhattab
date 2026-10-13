import {readDatabasePage} from "@platform/lib/supabase/read-page";
import "server-only";
import { requireAdmin } from "@platform/features/admin/identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { phoneConfirmationConfig } from "@platform/config/phone-confirmations";
export async function readPhoneConfirmations(page: number) {
  await requireAdmin();
  const client = createAuthAdministrator(), start = (page - 1) * phoneConfirmationConfig.pageSize;
  const query = client.from("account_contacts").select("user_id,email,phone_e164,updated_at", { count: "exact" })
    .is("phone_verified_at", null).not("phone_e164", "is", null).order("updated_at").order("user_id")
    .range(start, start + phoneConfirmationConfig.pageSize - 1);
  const {data,count}=await readDatabasePage(query);
  if (!data?.length) return { requests: [], total: count };
  const profiles = await client.from("profiles").select("id,name,username").in("id", data.map(row => row.user_id));
  if (profiles.error) throw new ApiError(503, "INTERNAL_ERROR");
  const byId = new Map(profiles.data.map(profile => [profile.id, profile]));
  return { total: count, requests: data.flatMap(row => {
    const profile = byId.get(row.user_id);
    return profile && row.phone_e164 ? [{ ...row, phone_e164: row.phone_e164, name: profile.name, username: profile.username }] : [];
  }) };
}
