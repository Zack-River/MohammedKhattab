import { assertCourseContent } from "../helpers/assert-course-content";
import { requireAdmin } from "../identity";
import { readAdminCourses } from "./courses";
import { editCourseMetadata } from "../helpers/edit-course-metadata";
import { ApiError } from "@platform/lib/api/error";
import type { Json } from "@platform/types/database";
import type { validateCourseEdit } from "../helpers/validate-course-edit";
export async function saveCourse(slug: string, values: NonNullable<ReturnType<typeof validateCourseEdit>>) {
  const { client } = await requireAdmin();
  const current = (await readAdminCourses(slug))[0];
  if (!current) throw new ApiError(404, "NOT_FOUND");
  if (values.revision !== undefined && values.revision !== current.revision) throw new ApiError(409,"COURSE_CONFLICT");
  const { amount, published } = values;
  const course = editCourseMetadata(current.course,values);
  if (published && course.delivery === "live" && !course.duration.trim()) throw new ApiError(400, "COURSE_DURATION_REQUIRED");
  assertCourseContent(course,published);
  const { error, data } = await client.from("courses").update({ metadata: JSON.parse(JSON.stringify(course)) as NonNullable<Json>, amount, published }).eq("slug",slug).eq("revision",current.revision).select("slug").maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(409, "COURSE_CONFLICT");
  return { saved: true };
}
