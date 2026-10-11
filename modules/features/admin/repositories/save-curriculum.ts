import { randomUUID } from "node:crypto";
import { requireAdmin } from "../identity";
import { readAdminCourses } from "./courses";
import { applyCurriculumMutation } from "../helpers/apply-curriculum-mutation";
import { assertCourseContent } from "../helpers/assert-course-content";
import type { CurriculumMutation } from "@platform/types/curriculum";
import { persistCurriculum } from "./persist-curriculum";
import { ApiError } from "@platform/lib/api/error";
export async function saveCurriculum(slug: string, input: CurriculumMutation) {
  await requireAdmin();
  const current = (await readAdminCourses(slug))[0];
  if (!current) throw new ApiError(404,"NOT_FOUND");
  if (current.revision !== input.revision) throw new ApiError(409,"COURSE_CONFLICT");
  const id = input.operation === "create" ? `${input.kind}-${randomUUID()}` : input.id!;
  const course = applyCurriculumMutation(current.course,input,id);
  assertCourseContent(course,current.published,"PUBLISHED_CURRICULUM_INCOMPLETE");
  const lesson = input.kind === "lesson" && input.operation !== "delete" ? { id, video_url: input.videoUrl!, preview: input.preview! } : null;
  await persistCurriculum(slug,input.revision,course.modules,lesson,input.kind === "lesson" && input.operation === "delete" ? id : undefined);
  return { saved: true, id };
}
