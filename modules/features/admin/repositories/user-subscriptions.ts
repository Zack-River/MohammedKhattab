import { courseProgress } from "@platform/features/learning/helpers/course-progress";
import { requireAdmin } from "../identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { publicCourse } from "@platform/features/catalog/helpers/public-course";
export async function readUserSubscriptions(id: string) {
  await requireAdmin();
  const client = createAuthAdministrator();
  const enrollments = await client.from("enrollments").select("course_slug,created_at,active,revision,access_expires_at").eq("user_id", id).order("created_at", { ascending: false });
  if (enrollments.error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!enrollments.data.length) return [];
  const progress = await client.from("lesson_progress").select("course_slug,lesson_id").eq("user_id", id).eq("completed", true);
  if (progress.error) throw new ApiError(503, "INTERNAL_ERROR");
  const completed = progress.data.map(row => `${row.course_slug}/${row.lesson_id}`);
  const courses = await client.from("courses").select("slug,metadata,amount").in("slug", enrollments.data.map(row => row.course_slug));
  if (courses.error) throw new ApiError(503, "INTERNAL_ERROR");
  return enrollments.data.flatMap(row => {
    const record = courses.data.find(course => course.slug === row.course_slug);
    if (!record) return [];
    const course = publicCourse(record.metadata, record.slug, record.amount);
    const { count, total, percent } = courseProgress(course, { completed });
    return [{ count, total, percent, slug: course.slug, title: course.title, delivery: course.delivery ?? "recorded" as const, enrolledAt: row.created_at, active: row.active, revision: row.revision, expiresAt:row.access_expires_at, expired:Boolean(row.access_expires_at&&Date.parse(row.access_expires_at)<=Date.now()) }];
  });
}
