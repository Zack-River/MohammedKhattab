import { requireAdmin } from "../identity";
import { publicCourse } from "@platform/features/catalog/helpers/public-course";
import { ApiError } from "@platform/lib/api/error";
export async function readAdminCourses(slug?: string) {
  const { client } = await requireAdmin();
  let query = client.from("courses").select("slug,metadata,amount,published,revision").order("position");
  if (slug) query = query.eq("slug", slug);
  const { data, error } = await query;
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return (data ?? []).map(row => ({ course: publicCourse(row.metadata, row.slug, Number(row.amount), { draft: !row.published }), published: row.published, revision: row.revision }));
}
export async function readAdminLessons(slug: string) {
  const { client } = await requireAdmin();
  const { data, error } = await client.from("lessons").select("id,video_url").eq("course_slug",slug).order("id");
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return data ?? [];
}
