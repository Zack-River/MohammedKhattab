import { courseContentGroups } from "@platform/features/catalog/helpers/course-content-groups";
import { numbered } from "@platform/features/catalog/helpers/numbered";
import { formatCourseDuration } from "@platform/features/catalog/helpers/format-course-duration";
import type { CourseModule } from "@platform/types/lms";
import type { CourseDetailsLabels } from "@platform/types/course-details";
import CurriculumLesson from "./curriculum-lesson";
export default function CurriculumChapter({ chapter, index, slug, enrolled, labels }: { chapter: CourseModule; index: number; slug: string; enrolled: boolean; labels: CourseDetailsLabels }) {
  const seconds = chapter.lessons.reduce((sum,lesson) => sum+lesson.durationSeconds,0);
  return <details open={index === 0}>
    <summary><span className="numeral">{numbered(index)}</span><b>{chapter.title}</b>
      <small>{chapter.lessons.length} {labels.lessons}{seconds > 0 && <> · {formatCourseDuration(seconds)}</>}</small>
    </summary>
    <div className="lms-curriculum-chapter-body">{courseContentGroups(chapter,labels.ungrouped).map(group => <div key={group.sectionId ? `section-${group.sectionId}` : "unassigned"}>
      {group.title && <h3>{group.title}</h3>}
      <ul>{group.lessons.map(lesson => <CurriculumLesson key={lesson.id} lesson={lesson} slug={slug} enrolled={enrolled} labels={labels} />)}</ul>
    </div>)}</div>
  </details>;
}
