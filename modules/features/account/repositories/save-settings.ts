import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { applicationOrigin } from "@platform/lib/application-origin";
import { readAccount } from "./read-account";
import { verifyCurrentPassword } from "../helpers/verify-password";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { readPhoneNumber } from "../helpers/phone-number";
import type { AccountSettingsInput } from "@platform/types/account";
export async function saveSettings(input: AccountSettingsInput) {
  const account = await readAccount(), client = createAuthAdministrator();
  if (input.email !== (account.pendingEmail ?? account.email) && !account.admin) throw new ApiError(403, "EMAIL_LOCKED");
  const emailChanged = input.email !== (account.pendingEmail ?? account.email), phoneChanged = input.phone !== account.phone;
  if (emailChanged || phoneChanged) await verifyCurrentPassword(account.email, input.currentPassword, account.id);
  if (emailChanged) {
    const { client: session } = await requireIdentity();
    const { error } = await session.auth.updateUser({ email: input.email }, { emailRedirectTo: `${applicationOrigin()}/api/auth/callback` });
    if (error) throw new ApiError(error.status === 429 ? 429 : 400, error.status === 429 ? "RATE_LIMITED" : "AUTH_FAILED");
  }
  const { error } = await client.rpc("save_account_settings", {
    p_user_id: account.id, p_first_name: input.firstName, p_last_name: input.lastName,
    p_username: input.username, p_phone: readPhoneNumber(input.phone)!.e164,
  });
  if (error) throw new ApiError(error.code === "23505" ? 409 : 503, error.code === "23505" ? "USERNAME_TAKEN" : "INTERNAL_ERROR");
  return readAccount();
}
