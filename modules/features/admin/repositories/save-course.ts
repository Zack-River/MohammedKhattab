import { validateCourse } from "@platform/features/catalog/helpers/validate-course";
import { validateLessons } from "@platform/features/catalog/helpers/validate-lessons";
import { requireAdmin } from "../identity";
import { readAdminCourses } from "./courses";
import { categories } from "@platform/config/catalog";
import { ApiError } from "@platform/lib/api/error";
import type { Json } from "@platform/types/database";
import type { validateCourseEdit } from "../helpers/validate-course-edit";
export async function saveCourse(slug: string, values: NonNullable<ReturnType<typeof validateCourseEdit>>) {
  const { client } = await requireAdmin();
  const current = (await readAdminCourses(slug))[0];
  if (!current) throw new ApiError(404, "NOT_FOUND");
  const { amount, published, ...metadata } = values;
  const course = { ...current.course, ...metadata, duration: metadata.duration ?? current.course.duration, categoryLabel: categories.find(category => category.id === values.category)!.label,
    offer: { ...current.course.offer, amount, amountLabel: undefined } };
  if (published && course.delivery === "live" && !course.duration.trim()) throw new ApiError(400, "COURSE_DURATION_REQUIRED");
  try { validateCourse(course, new Set(), { draft: !published }); validateLessons(course, course.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.resourceIds)), { draft: !published }); } catch { throw new ApiError(400, "INCOMPLETE_COURSE"); }
  const { error, data } = await client.from("courses").update({ metadata: JSON.parse(JSON.stringify(course)) as NonNullable<Json>, amount, published }).eq("slug",slug).select("slug").maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(404, "NOT_FOUND");
  return { saved: true };
}
