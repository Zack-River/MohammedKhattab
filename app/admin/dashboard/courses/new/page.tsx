import { requireAdminPage } from "@platform/features/admin/page-identity";
import PageHeading from "@platform/components/ui/page-heading";
import CourseCreateForm from "@platform/components/admin/course-create-form";
import { adminCoursesCopy } from "@platform/data/admin-courses";
import { adminCopy } from "@platform/data/admin";
import { thumbnailUploadCopy } from "@platform/data/image-upload";
import { categories } from "@platform/config/catalog";
export default async function CreateCoursePage() {
 await requireAdminPage();
 return <><PageHeading title={adminCoursesCopy.createTitle} /><CourseCreateForm labels={adminCoursesCopy} editorLabels={adminCopy} uploadLabels={thumbnailUploadCopy} categories={categories.filter(category => category.id !== "all")} /></>;
}
