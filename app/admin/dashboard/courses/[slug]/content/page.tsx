import { templateCopy } from "@platform/data/workshop-template";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readAdminCourses, readAdminLessons } from "@platform/features/admin/repositories/courses";
import { adminCoursesCopy } from "@platform/data/admin-courses";
import { curriculumCopy } from "@platform/data/curriculum";
import PageHeading from "@platform/components/ui/page-heading";
import CourseEditorTabs from "@platform/components/admin/course-editor-tabs";
import CourseContent from "@platform/components/admin/course-content";
export default async function CourseContentPage({ params }: { params: Promise<{ slug:string }> }) {
 await requireAdminPage();const {slug}=await params;
 const [records,lessons]=await Promise.all([readAdminCourses(slug),readAdminLessons(slug)]),record=records[0];
 if (!record) notFound();
 return <><PageHeading title={record.course.title} /><CourseEditorTabs slug={slug} active="content" labels={adminCoursesCopy} templateLabel={templateCopy.title} /><CourseContent course={record.course} revision={record.revision} published={record.published} lessons={lessons} labels={curriculumCopy} /></>;
}
