import type { DatabaseClient } from "@platform/types/database-client";
import type { User } from "@supabase/supabase-js";
import { ApiError } from "@platform/lib/api/error";
import { interfaceCopy } from "@platform/data/interface-copy";
export async function readProfile(client: DatabaseClient, user: User) {
  const { data, error } = await client.from("profiles").select("name").eq("id", user.id).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  const name = data?.name ?? interfaceCopy.demoLearnerName;
  return { name, email: user.email ?? "" };
}
