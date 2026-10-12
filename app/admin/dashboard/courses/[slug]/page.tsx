import { templateCopy } from "@platform/data/workshop-template";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readAdminCourses } from "@platform/features/admin/repositories/courses";
import CourseEditor from "@platform/components/admin/course-editor";
import CourseEditorTabs from "@platform/components/admin/course-editor-tabs";
import { adminCoursesCopy } from "@platform/data/admin-courses";
import PageHeading from "@platform/components/ui/page-heading";
import { thumbnailUploadCopy } from "@platform/data/image-upload";
import { adminCopy } from "@platform/data/admin";
import { categories } from "@platform/config/catalog";
import { routes } from "@platform/config/navigation";
import { requireAdminPage } from "@platform/features/admin/page-identity";
export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminPage();
  const { slug } = await params;
  const record = (await readAdminCourses(slug))[0];
  if (!record) notFound();
  return <><PageHeading title={record.course.title}>{record.published && <Link href={routes.course(slug, record.course.delivery)} className="lms-text-link">{adminCopy.publicPage}</Link>}</PageHeading>
    <CourseEditorTabs slug={slug} active="overview" labels={adminCoursesCopy} templateLabel={templateCopy.title} /><CourseEditor {...record} labels={adminCopy} uploadLabels={thumbnailUploadCopy} categories={categories.filter(category => category.id !== "all")} />
  </>;
}
