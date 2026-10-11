import { requireAdmin } from "../identity";
import type { CourseModule } from "@platform/types/lms";
import type { Json } from "@platform/types/database";
import { ApiError } from "@platform/lib/api/error";
export async function persistCurriculum(slug: string, revision: number, modules: CourseModule[], lesson: { id: string; video_url: string; preview: boolean } | null, deletedId?: string) {
  const { client } = await requireAdmin();
  const { error } = await client.rpc("save_admin_curriculum", { p_slug: slug, p_revision: revision, p_modules: JSON.parse(JSON.stringify(modules)) as Json, p_lesson: lesson, p_deleted_id: deletedId });
  if (!error) return;
  const code = ["COURSE_CONFLICT","NOT_FOUND","FORBIDDEN"].find(code => error.message.includes(code));
  throw new ApiError(code === "COURSE_CONFLICT" ? 409 : code === "NOT_FOUND" ? 404 : code === "FORBIDDEN" ? 403 : 503,code ?? "INTERNAL_ERROR");
}
