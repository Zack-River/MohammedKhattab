import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { CourseDetailsProps } from "@platform/types/course-details";
import CourseOverview from "./course-overview";
import CourseIntro from "./course-intro";
import CourseDescription from "./course-description";
import CourseOutcomes from "./course-outcomes";
import Curriculum from "./curriculum";
import CourseInstructor from "./course-instructor";
import EnrollmentPanel from "./enrollment-panel";
export default function CourseDetails(props: CourseDetailsProps) {
  const { course, labels, instructor, site, copy } = props;
  return <main className="container lms-public-main lms-course-details-page">
    <nav className="lms-breadcrumb" aria-label={props.breadcrumbLabel}><Link href={routes.courses}>{props.breadcrumbLabel}</Link><span aria-hidden="true">/</span><span>{course.categoryLabel}</span></nav>
    <CourseOverview course={course} instructor={instructor} />
    <div className="lms-course-detail">
      <div className="lms-course-detail-content"><CourseIntro course={{slug:course.slug,title:course.title,introVideoUrl:course.introVideoUrl,thumbnailUrl:course.thumbnailUrl,artwork:course.artwork}} site={site} playLabel={labels.intro} />
        <div className="lms-course-detail-body"><CourseDescription title={labels.about} description={course.description} />
        {course.outcomes.length > 0 && <CourseOutcomes copy={copy} course={course} />}
        <Curriculum course={course} labels={labels} enrolled={props.enrolled} /></div>
      </div>
      <aside className="lms-course-detail-sidebar"><EnrollmentPanel {...props} /><CourseInstructor instructor={instructor} labels={labels} /></aside>
    </div>
  </main>;
}
