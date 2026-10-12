import { notFound } from "next/navigation";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readAdminCourses } from "@platform/features/admin/repositories/courses";
import { readWorkshopTemplate } from "@platform/features/marketing/templates/repository";
import { defaultWorkshopTemplate } from "@platform/features/marketing/templates/default-template";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { templateCopy,templateFieldLabels } from "@platform/data/workshop-template";
import { adminCoursesCopy } from "@platform/data/admin-courses";
import CourseEditorTabs from "@platform/components/admin/course-editor-tabs";
import PageHeading from "@platform/components/ui/page-heading";
import WorkshopTemplateEditor from "@platform/components/admin/template/template-editor";
export default async function TemplatePage({params}:{params:Promise<{slug:string}>}) {
 await requireAdminPage();const {slug}=await params,record=(await readAdminCourses(slug))[0];
 if(!record || record.course.delivery!=='live') notFound();
 const template=await readWorkshopTemplate(record.course);
 return <><PageHeading title={templateCopy.title} /><CourseEditorTabs slug={slug} active="template" labels={adminCoursesCopy} templateLabel={templateCopy.title} /><WorkshopTemplateEditor key={template.revision} slug={slug} record={template} defaults={defaultWorkshopTemplate(record.course)} labels={{copy:templateCopy,fields:templateFieldLabels}} sample={defaultWorkshopTemplate(liveWorkshopCourse)} /></>;
}
