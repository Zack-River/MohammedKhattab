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
  const course = { ...current.course, ...metadata, categoryLabel: categories.find(category => category.id === values.category)!.label,
    offer: { ...current.course.offer, amount, amountLabel: undefined } };
  const { error, data } = await client.from("courses").update({ metadata: JSON.parse(JSON.stringify(course)) as NonNullable<Json>, amount, published }).eq("slug",slug).select("slug").maybeSingle();
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  if (!data) throw new ApiError(404, "NOT_FOUND");
  return { saved: true };
}
