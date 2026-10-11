import type { Course } from "@platform/types/lms";
import { validateCourse } from "@platform/features/catalog/helpers/validate-course";
import { validateLessons } from "@platform/features/catalog/helpers/validate-lessons";
import { ApiError } from "@platform/lib/api/error";
export function assertCourseContent(course: Course, published: boolean, code = "INCOMPLETE_COURSE") {
  try {
    validateCourse(course,new Set(),{ draft: !published });
    validateLessons(course,course.modules.flatMap(chapter => chapter.lessons.flatMap(lesson => lesson.resourceIds)),{ draft: !published });
  } catch { throw new ApiError(400,code); }
}
