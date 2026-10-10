import type { DatabaseClient } from "@platform/types/database-client";
import type { User } from "@supabase/supabase-js";
import { profilePolicy } from "@platform/features/profile/validation";
import { interfaceCopy } from "@platform/data/interface-copy";
import { ApiError } from "@platform/lib/api/error";
export async function ensureProfile(client: DatabaseClient, user: User) {
  const candidate = user.user_metadata.name;
  const name = typeof candidate === "string" && candidate.trim().length >= profilePolicy.nameMin && candidate.trim().length <= profilePolicy.nameMax ? candidate.trim() : interfaceCopy.demoLearnerName;
  const { error } = await client.from("profiles").upsert({ id: user.id, name }, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
}
