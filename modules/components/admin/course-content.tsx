import type { Course } from "@platform/types/lms";
import type { CurriculumLabels } from "@platform/types/curriculum";
import { curriculumCourse } from "@platform/features/admin/helpers/curriculum-course";
import CurriculumAction from "./curriculum/curriculum-action";
import ChapterCard from "./curriculum/chapter-card";
export default function CourseContent({ course, revision, published, lessons, labels }: { course: Course; revision: number; published: boolean; lessons: { id: string; video_url: string }[]; labels: CurriculumLabels }) {
  const context = { course: curriculumCourse(course), revision, labels, videos: Object.fromEntries(lessons.map(lesson => [lesson.id,lesson.video_url])) };
  return <div className="lms-curriculum">
    <div className="lms-curriculum-heading"><p className="lms-curriculum-note">{published ? labels.publishedHint : course.modules.length ? labels.draftHint : labels.emptyCourse}</p><div className="lms-admin-actions"><CurriculumAction context={context} target={{ kind: "chapter", operation: "create" }} label={labels.addChapter} /></div></div>
    {context.course.modules.map(chapter => <ChapterCard key={chapter.id} context={context} chapter={chapter} />)}
  </div>;
}
