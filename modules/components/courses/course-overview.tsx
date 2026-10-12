import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
import type { CourseDetailsProps } from "@platform/types/course-details";
export default function CourseOverview({ course, instructor }: Pick<CourseDetailsProps,"course" | "instructor">) {
  return <header className="lms-course-overview" data-reveal>
    <p className="lms-heading-context">{course.categoryLabel}</p>
    <h1 className="lms-course-title">{course.title}</h1>
    <Link className="lms-course-author" href={instructor.href}><Symbol name="user" />{instructor.name}</Link>
  </header>;
}
