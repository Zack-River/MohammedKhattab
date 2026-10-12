import Link from "next/link";
import { routes } from "@platform/config/navigation";
import type { AdminCoursesLabels } from "@platform/types/admin-courses";
export default function CourseEditorTabs({ slug, active, labels, templateLabel }: { slug: string; active: "overview" | "content" | "template"; templateLabel?: string; labels: AdminCoursesLabels }) {
 return <nav className="lms-course-editor-tabs" aria-label={labels.heading}><Link className="lms-secondary-button" aria-current={active === "overview" ? "page" : undefined} href={routes.adminCourse(slug)}>{labels.overview}</Link><Link className="lms-secondary-button" aria-current={active === "content" ? "page" : undefined} href={routes.adminCourseContent(slug)}>{labels.content}</Link>{templateLabel && <Link className="lms-secondary-button" aria-current={active === "template" ? "page" : undefined} href={routes.adminCourseTemplate(slug)}>{templateLabel}</Link>}</nav>;
}
