import Link from "next/link";
import { readAdminCourses } from "@platform/features/admin/repositories/courses";
import { routes } from "@platform/config/navigation";
import { adminCopy } from "@platform/data/admin";
import PageHeading from "@platform/components/ui/page-heading";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export default async function AdminCoursesPage() {
  await requireAdminPage();
  const records = await readAdminCourses();
  return <><PageHeading title={adminCopy.heading} description={adminCopy.description} /><div className="lms-resource-grid">{records.map(({ course }) =>
    <section key={course.slug} className="lms-resource-card"><h2>{course.title}</h2><p>{course.categoryLabel}</p><Link href={routes.adminCourse(course.slug)} className="btn-primary">{adminCopy.edit}</Link></section>
  )}</div></>;
}
