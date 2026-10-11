import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { formatCourseDate } from "@platform/helpers/format-course-date";
import type { AdminCourseRow, AdminCoursesLabels } from "@platform/types/admin-courses";
import CourseDeleteButton from "./course-delete-button";
export default function CourseTable({ courses, labels }: { courses: AdminCourseRow[]; labels: AdminCoursesLabels }) {
  const columns = ["name", "createdAt", "updatedAt", "students", "lessons", "chapters", "sections", "actions"] as const;
  const counts = ["students", "lessons", "chapters", "sections"] as const;
  return <div className="lms-admin-table-wrap" data-reveal>
    <table className="lms-admin-table lms-course-table" role="table">
      <caption className="lms-visually-hidden">{labels.heading}</caption>
      <thead><tr>{columns.map(column => <th key={column} scope="col">{labels[column]}</th>)}</tr></thead>
      <tbody role="rowgroup">{courses.map(course => <tr key={course.slug} role="row">
        <th scope="row" role="rowheader">
          <Link className="lms-admin-name" href={routes.adminCourse(course.slug)}>{course.title}</Link>
          <small className="lms-admin-role">{labels[course.published ? "published" : "draft"]}</small>
        </th>
        <td role="cell" data-label={labels.createdAt}>{formatCourseDate(course.createdAt, labels.unknownDate)}</td>
        <td role="cell" data-label={labels.updatedAt}>{formatCourseDate(course.updatedAt, labels.unknownDate)}</td>
        {counts.map(key => <td role="cell" key={key} data-label={labels[key]} className="numeral">{course[key]}</td>)}
        <td role="cell" className="lms-admin-row-actions">
          <Link href={routes.adminCourse(course.slug)} className="lms-secondary-button">{labels.edit}</Link>
          <CourseDeleteButton course={course} labels={labels} />
        </td>
      </tr>)}</tbody>
    </table>
    {!courses.length && <p className="lms-admin-empty">{labels.empty}</p>}
  </div>;
}
