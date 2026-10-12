import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readTemplateSubject } from "@platform/features/marketing/templates/template-subject";
import { readWorkshopTemplate } from "@platform/features/marketing/templates/repository";
import { defaultWorkshopTemplate } from "@platform/features/marketing/templates/default-template";
import { templateCopy,templateFieldLabels } from "@platform/data/workshop-template";
import { commerceCopy } from "@platform/data/commerce";
import { routes,endpoints } from "@platform/config/navigation";
import PageHeading from "@platform/components/ui/page-heading";
import WorkshopTemplateEditor from "@platform/components/admin/template/template-editor";
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 await requireAdminPage();const {slug}=await params,course=await readTemplateSubject("bundle",slug);if(!course) notFound();
 const record=await readWorkshopTemplate(course,"bundle"),defaults=defaultWorkshopTemplate(course,"bundle");
 return <><PageHeading title={course.title} /><Link className="lms-text-link" href={routes.adminCommerce()}>{commerceCopy.bundles}</Link><WorkshopTemplateEditor key={record.revision} slug={slug} endpoint={endpoints.adminBundleTemplate(slug)} record={record} defaults={defaults} sample={defaults} labels={{copy:templateCopy,fields:templateFieldLabels}} /></>;
}
