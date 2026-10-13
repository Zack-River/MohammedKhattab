import "server-only";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import type { Resource } from "@platform/types/lms";
/** Both queries use the learner session; RLS enforces enrollment and publication. */
export async function listLessonResources(slug: string, lessonId: string): Promise<Omit<Resource, "content">[]> {
  const { client } = await requireIdentity();
  const links = await client.from("lesson_resources").select("resource_id").eq("course_slug", slug).eq("lesson_id", lessonId);
  if (links.error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!links.data.length) return [];
  const result = await client.from("resources").select("id,title,description,type").in("id", links.data.map(link => link.resource_id)).order("title");
  if (result.error) throw new ApiError(503, "INTERNAL_ERROR");
  return result.data;
}
