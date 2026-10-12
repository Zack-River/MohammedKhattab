import { sectionIds } from "@platform/config/navigation";
import type { CourseDetailsProps } from "@platform/types/course-details";
import CoursePrice from "./course-price";
import CourseFacts from "./course-facts";
import CourseEnrollmentAction from "./course-enrollment-action";
export default function EnrollmentPanel({ course, copy, labels, priceLabel, enrolled, nextLesson, supportHref }: Pick<CourseDetailsProps,"course" | "copy" | "labels" | "priceLabel" | "enrolled" | "nextLesson" | "supportHref">) {
  return <section className="lms-enrollment-card" id={sectionIds.enrollment} aria-label={labels.included}>
    <div className="lms-enrollment-body">
      <CoursePrice offer={course.offer.amount === 0 ? { ...course.offer, amountLabel: labels.free } : course.offer} offerCopy={{price:priceLabel}} />
      <CourseEnrollmentAction course={course} copy={copy} labels={labels} enrolled={enrolled} nextLesson={nextLesson} supportHref={supportHref} />
      {!enrolled && <p className="lms-course-purchase-hint">{labels.purchaseHint}</p>}
      <CourseFacts course={course} labels={labels} />
      {course.modules.length > 0 && <a className="lms-course-text-link" href={`#${sectionIds.courseContent}`}>{labels.curriculumNavigation}</a>}
    </div>
  </section>;
}
