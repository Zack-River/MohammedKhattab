import { categories } from "@platform/config/catalog";
import type { Course } from "@platform/types/lms";
import type { validateCourseEdit } from "./validate-course-edit";
export function editCourseMetadata(current: Course, values: NonNullable<ReturnType<typeof validateCourseEdit>>): Course {
  return {
    ...current,
    ...(values.featured !== undefined ? { featured: values.featured } : {}),
    title: values.title,
    description: values.description,
    duration: current.delivery === "live" ? values.duration ?? current.duration : "",
    category: values.category,
    categoryLabel: categories.find(category => category.id === values.category)!.label,
    thumbnailUrl: values.thumbnailUrl,
    introVideoUrl: values.introVideoUrl,
    offer: { ...current.offer, amount: values.amount, amountLabel: undefined },
  };
}
