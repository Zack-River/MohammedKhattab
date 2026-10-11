import type { Course } from "@platform/types/lms";
export function validateSections(course: Course) {
  for (const chapter of course.modules) {
    const ids = new Set<string>(), assigned = new Set<string>();
    const lessons = new Set(chapter.lessons.map(lesson => lesson.id));
    for (const section of chapter.sections ?? []) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(section.id) || !section.title.trim() || ids.has(section.id) ||
          new Set(section.lessonIds).size !== section.lessonIds.length ||
          section.lessonIds.some(id => !lessons.has(id) || assigned.has(id)))
        throw new Error(`Invalid course section: ${course.slug}`);
      ids.add(section.id);
      section.lessonIds.forEach(id => assigned.add(id));
    }
  }
}
