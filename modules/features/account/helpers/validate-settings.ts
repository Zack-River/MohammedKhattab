import { authPolicy } from "@platform/config/auth";
import { isValidUsername, normalizeUsername } from "@platform/helpers/validation/username";
import { isValidEmail } from "@platform/helpers/validation/email";
import { readPhoneNumber } from "./phone-number";
import type { AccountSettingsInput } from "@platform/types/account";
export function validateSettings(input: unknown): AccountSettingsInput | null {
  if (!input || typeof input !== "object") return null;
  const v = input as Record<string, unknown>;
  if (!["firstName", "lastName", "email", "phone"].every(key => typeof v[key] === "string")) return null;
  const firstName = (v.firstName as string).trim(), lastName = (v.lastName as string).trim();
  if (!firstName || `${firstName} ${lastName}`.trim().length < authPolicy.nameMin || `${firstName} ${lastName}`.trim().length > authPolicy.nameMax || /[\r\n\t]/.test(firstName + lastName)) return null;
  if (!isValidUsername(v.username) || !isValidEmail(v.email as string, authPolicy.emailMax) || !readPhoneNumber(v.phone)) return null;
  if (v.currentPassword !== undefined && (typeof v.currentPassword !== "string" || v.currentPassword.length > authPolicy.passwordMax)) return null;
  return { firstName, lastName, username: normalizeUsername(v.username), email: (v.email as string).trim().toLowerCase(), phone: v.phone as string, currentPassword: v.currentPassword as string ?? "" };
}
