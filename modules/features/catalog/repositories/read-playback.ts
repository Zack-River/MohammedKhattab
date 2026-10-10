import { createDatabaseClient } from "@platform/lib/supabase/server";
import { ApiError } from "@platform/lib/api/error";
export async function readPlayback(slug: string, id: string) {
  const client = await createDatabaseClient();
  const { data, error } = await client.from("lessons").select("video_url").eq("course_slug", slug).eq("id", id).maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(403, "FORBIDDEN");
  return data.video_url as string;
}
