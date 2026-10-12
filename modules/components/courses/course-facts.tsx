import type { CourseDetailsProps } from "@platform/types/course-details";
import { courseLessons } from "@platform/features/catalog/helpers/course-lessons";
export default function CourseFacts({ course, labels }: Pick<CourseDetailsProps,"course" | "labels">) {
  const lessons = courseLessons(course).length;
  const facts = [
    { label: labels.delivery, value: course.delivery === "live" ? course.deliveryLabel || labels.live : labels.recorded },
    ...(course.duration ? [{ label: labels.duration, value: course.duration }] : []),
    ...(lessons ? [{ label: labels.lessons, value: lessons }, { label: labels.chapters, value: course.modules.length }] : []),
  ];
  return <dl className="lms-course-facts">{facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>;
}
