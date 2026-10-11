import { requireAdminPage } from "@platform/features/admin/page-identity";
import PageHeading from "@platform/components/ui/page-heading";
import CourseCreateForm from "@platform/components/admin/course-create-form";
import { adminCoursesCopy } from "@platform/data/admin-courses";
import { categories } from "@platform/config/catalog";
export default async function CreateCoursePage() {
 await requireAdminPage();
 return <><PageHeading title={adminCoursesCopy.createTitle} description={adminCoursesCopy.createHint} /><section className="lms-profile-card" data-reveal><CourseCreateForm labels={adminCoursesCopy} categories={categories.filter(category => category.id !== "all")} /></section></>;
}
