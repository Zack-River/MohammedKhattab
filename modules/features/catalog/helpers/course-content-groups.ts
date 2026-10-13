import type { CourseModule } from "@platform/types/lms";
export function courseContentGroups(chapter: CourseModule, ungroupedLabel: string) {
  const lessonsById = new Map(chapter.lessons.map(lesson => [lesson.id, lesson]));
  const grouped = new Set(chapter.sections?.flatMap(section => section.lessonIds));
  const groups = (chapter.sections ?? []).map(section => ({
    id: section.id, sectionId: section.id as string | undefined, title: section.title,
    lessons: section.lessonIds.flatMap(id => {
      const lesson = lessonsById.get(id);
      return lesson ? [lesson] : [];
    }),
  }));
  const ungrouped = chapter.lessons.filter(lesson => !grouped.has(lesson.id));
  if (ungrouped.length) groups.push({ id: "ungrouped", sectionId: undefined, title: chapter.sections?.length ? ungroupedLabel : "", lessons: ungrouped });
  return groups;
}
