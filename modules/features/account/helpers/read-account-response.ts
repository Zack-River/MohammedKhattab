import type { AccountProfile } from "@platform/types/account";
export function readAccountResponse(input: unknown): AccountProfile {
  if (!input || typeof input !== "object") throw new Error("Invalid account response");
  const v = input as Record<string, unknown>;
  if (!["id", "name", "username", "firstName", "lastName", "email", "phone"].every(key => typeof v[key] === "string") ||
    !["admin", "emailVerified", "phoneVerified"].every(key => typeof v[key] === "boolean") ||
    !(v.pendingEmail === null || typeof v.pendingEmail === "string") || !(v.avatarUrl === null || typeof v.avatarUrl === "string")) throw new Error("Invalid account response");
  return v as unknown as AccountProfile;
}
