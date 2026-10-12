import type { CourseDetailsProps } from "@platform/types/course-details";
import CurriculumChapter from "./curriculum-chapter";
import { sectionIds } from "@platform/config/navigation";
export default function Curriculum({ course, labels, enrolled }: Pick<CourseDetailsProps,"course" | "labels" | "enrolled">) {
  return <section className="lms-course-curriculum" id={sectionIds.courseContent} data-reveal>
    <div className="lms-content-heading"><h2>{labels.content}</h2></div>
    {course.modules.length ? <div className="lms-curriculum">{course.modules.map((chapter,index) => <CurriculumChapter key={chapter.id ?? index} chapter={chapter} index={index} slug={course.slug} enrolled={enrolled} labels={labels} />)}</div>
      : <p className="lms-field-hint">{labels.upcomingContent}</p>}
  </section>;
}
