import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { AdminCoursesLabels } from "@platform/types/admin-courses";
export default function CourseEditorTabs({ slug, active, labels }: { slug: string; active: "overview" | "content"; labels: AdminCoursesLabels }) {
 return <nav className="lms-course-editor-tabs" aria-label={labels.heading}><Link className="lms-secondary-button" aria-current={active === "overview" ? "page" : undefined} href={routes.adminCourse(slug)}>{labels.overview}</Link><Link className="lms-secondary-button" aria-current={active === "content" ? "page" : undefined} href={routes.adminCourseContent(slug)}>{labels.content}</Link></nav>;
}
