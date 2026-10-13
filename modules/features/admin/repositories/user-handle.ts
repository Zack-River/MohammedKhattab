import "server-only";
import { requireAdmin } from "../identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { isValidUsername, normalizeUsername } from "@platform/helpers/validation/username";
import {validUuid} from "@platform/helpers/validation/uuid";
import { readAdminUser } from "./users";
/** Resolve a public-facing handle only after authorization; mutations continue using immutable IDs. */
export async function resolveAdminUser(handle: string) {
  await requireAdmin();
  if (!isValidUsername(handle)) throw new ApiError(404, "NOT_FOUND");
  const { data, error } = await createAuthAdministrator().from("profiles")
    .select("id").eq("username", normalizeUsername(handle)).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (data) return readAdminUser(data.id);
  // Existing UUID bookmarks redirect to the stored username in the page.
  if (validUuid(handle)) return readAdminUser(handle);
  throw new ApiError(404, "NOT_FOUND");
}
