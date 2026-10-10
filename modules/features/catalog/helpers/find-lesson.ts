import type { Course } from "@platform/types/lms";
import { courseLessons } from "./course-lessons";
export const findLesson = (course: Course, id: string) =>
  courseLessons(course).find((lesson) => lesson.id === id);
