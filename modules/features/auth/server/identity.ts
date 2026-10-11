import "server-only";
import { cache } from "react";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { ApiError } from "@platform/lib/api/error";
export const currentIdentity = cache(async () => {
  const client = await createDatabaseClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const access = await client.rpc("account_access_allowed");
  if (access.error) throw new ApiError(503, "INTERNAL_ERROR");
  return access.data ? { client, user: data.user } : null;
});
export async function requireIdentity() {
  const identity = await currentIdentity();
  if (!identity) throw new ApiError(401, "UNAUTHENTICATED");
  return identity;
}
