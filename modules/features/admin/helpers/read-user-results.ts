import type { AdminUser, AdminUserPage } from "@platform/types/admin-users";
import { ApiError } from "@platform/lib/api/error";
function isUser(value: unknown): value is AdminUser {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return ["id", "name", "username", "email"].every(key => typeof item[key] === "string")
    && ["admin", "confirmed", "permanentlyBanned"].every(key => typeof item[key] === "boolean")
    && ["avatarUrl", "suspendedUntil"].every(key => item[key] === null || typeof item[key] === "string");
}
export function readUserResults(value: unknown): AdminUserPage {
  if (value && typeof value === "object") {
    const result = value as Record<string, unknown>;
    if (Array.isArray(result.users) && result.users.every(isUser) && typeof result.page === "number" && Number.isInteger(result.page)
      && typeof result.hasNext === "boolean" && typeof result.total === "number" && Number.isInteger(result.total)) {
      return { users: result.users, page: result.page, hasNext: result.hasNext, total: result.total };
    }
  }
  throw new ApiError(503, "INTERNAL_ERROR");
}
