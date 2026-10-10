import { artworkKinds, categories } from "@platform/config/catalog";
import type { Course } from "@platform/types/lms";
export function validateCourse(course: Course, slugs: Set<string>) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.slug) || slugs.has(course.slug) ||
      !course.title.trim() || (!course.modules.length && course.delivery !== "live") ||
      !categories.some((category) => category.id === course.category) ||
      !artworkKinds.includes(course.artwork) || !Number.isFinite(course.offer.amount) ||
      course.offer.amount < 0 || !course.offer.actionLabel.trim())
    throw new Error(`Invalid course: ${course.slug}`);
  if (course.delivery === "live" && (!course.deliveryLabel?.trim() || !course.duration.trim())) throw new Error(`Invalid live course: ${course.slug}`);
  if (course.modules.some((module) => !module.title.trim() || !module.lessons.length))
    throw new Error(`Empty published module: ${course.slug}`);
}
