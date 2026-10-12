import type { CourseModule } from "@platform/types/lms";
export function courseContentGroups(chapter: CourseModule, ungroupedLabel: string) {
  const grouped = new Set(chapter.sections?.flatMap(section => section.lessonIds));
  const groups = (chapter.sections ?? []).map(section => ({
    id: section.id, sectionId: section.id as string | undefined, title: section.title,
    lessons: chapter.lessons.filter(lesson => section.lessonIds.includes(lesson.id)),
  }));
  const ungrouped = chapter.lessons.filter(lesson => !grouped.has(lesson.id));
  if (ungrouped.length) groups.push({ id: "ungrouped", sectionId: undefined, title: chapter.sections?.length ? ungroupedLabel : "", lessons: ungrouped });
  return groups;
}
