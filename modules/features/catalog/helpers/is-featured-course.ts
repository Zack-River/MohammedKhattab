import type { Course } from "@platform/types/lms";
export const isFeaturedCourse = (course: Pick<Course, "featured">) =>
  course.featured === true;
