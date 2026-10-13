import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { findCourse } from "@platform/features/catalog/service";
import { findLesson } from "@platform/features/catalog/helpers";
import { readState } from "./read-state";
export async function saveProgress(slug: string, id: string, completed: boolean) {
  const { client, user } = await requireIdentity();
  const course = await findCourse(slug);
  if (!course || !findLesson(course, id)) throw new ApiError(404, "NOT_FOUND");
  const { data, error: accessError } = await client.from("enrollments").select("course_slug").eq("active", true).eq("user_id", user.id).eq("course_slug", slug).maybeSingle();
  if (accessError) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(403, "FORBIDDEN");
  const { error } = await client.from("lesson_progress").upsert({ user_id: user.id, course_slug: slug, lesson_id: id, completed }, { onConflict: "user_id,course_slug,lesson_id" });
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return readState(client, user);
}
