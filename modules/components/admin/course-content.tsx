import type { Course } from "@platform/types/lms";
import type { AdminCoursesLabels } from "@platform/types/admin-courses";
import { courseContentGroups } from "@platform/features/admin/helpers/course-content-groups";
import LessonVideoEditor from "./lesson-video-editor";
export default function CourseContent({ course, lessons, labels, editorLabels }: {
  course: Course; lessons: { id: string; video_url: string }[]; labels: AdminCoursesLabels;
  editorLabels: Record<string, string> & { save: string; saving: string; saved: string };
}) {
  const records = new Map(lessons.map(lesson => [lesson.id, lesson]));
  return <>
    {!course.modules.length && <p className="lms-admin-empty">{labels.noContent}</p>}
    {course.modules.map((chapter, index) => <section className="lms-profile-card" key={`${index}-${chapter.title}`} data-reveal>
      <h2>{chapter.title}</h2>
      {courseContentGroups(chapter, labels.ungrouped).map((group, groupIndex) => <div key={`${groupIndex}-${group.id}`}>
        {group.title && <h3>{group.title}</h3>}
        {group.lessons.map(lesson => {
          const record = records.get(lesson.id);
          return record ? <LessonVideoEditor key={lesson.id} slug={course.slug} lesson={{ ...record, title: lesson.title }} labels={editorLabels} />
            : <div key={lesson.id}><h4>{lesson.title}</h4><p>{labels.noVideo}</p></div>;
        })}
      </div>)}
    </section>)}
  </>;
}
