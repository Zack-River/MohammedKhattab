import "server-only";
import { cache } from "react";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { ApiError } from "@platform/lib/api/error";
export const currentIdentity = cache(async () => {
  const client = await createDatabaseClient();
  const { data, error } = await client.auth.getUser();
  return error || !data.user ? null : { client, user: data.user };
});
export async function requireIdentity() {
  const identity = await currentIdentity();
  if (!identity) throw new ApiError(401, "UNAUTHENTICATED");
  return identity;
}
