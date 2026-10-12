import type { Course } from "@platform/types/lms";
export const isFeaturedWorkshop = (course: Pick<Course, "delivery" | "featured">) =>
  course.delivery === "live" && course.featured === true;
