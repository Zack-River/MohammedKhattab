import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { hasAdminAccess } from "@platform/features/admin/identity";
import { ApiError } from "@platform/lib/api/error";
import { displayPhoneNumber } from "../helpers/phone-number";
import type { AccountProfile } from "@platform/types/account";
export async function readAccount(): Promise<AccountProfile> {
  const { client, user } = await requireIdentity();
  const [profile, contact, admin] = await Promise.all([
    client.from("profiles").select("*").eq("id", user.id).single(),
    client.from("account_contacts").select("*").eq("user_id", user.id).single(), hasAdminAccess(),
  ]);
  if (profile.error || contact.error) throw new ApiError(503, "INTERNAL_ERROR");
  const p = profile.data, c = contact.data;
  return { id: user.id, name: p.name, username: p.username, firstName: p.first_name, lastName: p.last_name,
    email: c.email, pendingEmail: c.pending_email, phone: displayPhoneNumber(c.phone_e164),
    avatarUrl: p.avatar_url?.startsWith("https://") ? p.avatar_url : null, admin,
    emailVerified: Boolean(c.email_verified_at && !c.pending_email && user.email_confirmed_at && !user.new_email), phoneVerified: Boolean(c.phone_e164 && c.phone_verified_at) };
}
