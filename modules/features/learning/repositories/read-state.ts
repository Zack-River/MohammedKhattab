import type { DatabaseClient } from "@platform/types/database-client";
import type { User } from "@supabase/supabase-js";
import { readProfile } from "@platform/features/profile/repositories/read-profile";
import { ApiError } from "@platform/lib/api/error";
import type { LearningState } from "@platform/types/lms";
export async function readState(client: DatabaseClient, user: User): Promise<LearningState> {
  const [profile, enrollment, progress] = await Promise.all([
    readProfile(client, user),
    client.from("enrollments").select("course_slug").eq("user_id", user.id),
    client.from("lesson_progress").select("course_slug,lesson_id").eq("user_id", user.id).eq("completed", true),
  ]);
  if (enrollment.error || progress.error) throw new ApiError(503, "INTERNAL_ERROR");
  return { profile, enrolled: enrollment.data.map((row) => row.course_slug), completed: progress.data.map((row) => `${row.course_slug}/${row.lesson_id}`) };
}
