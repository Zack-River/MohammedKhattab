import {requireAdminPage} from "@platform/features/admin/page-identity";
import {adminCourseChoices} from "@platform/features/admin/repositories/course-choices";
import {readAdminMaterials} from "@platform/features/resources/admin-repository";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import MaterialManager from "@platform/components/resources/material-manager";
import RecordFilters from "@platform/components/admin/record-filters";
import RecordPagination from "@platform/components/admin/record-pagination";
import PageHeading from "@platform/components/ui/page-heading";
import {materialCopy as labels} from "@platform/data/materials";
import {materialPolicy as p} from "@platform/config/materials";
import {routes} from "@platform/config/navigation";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 await requireAdminPage();const query=readRecordQuery(await searchParams,p.kinds),[result,courses]=await Promise.all([readAdminMaterials(query),adminCourseChoices()]);
 return <><PageHeading title={labels.title}/><RecordFilters action={routes.adminTools} query={query} options={[{value:"all",label:labels.all},...p.kinds.map(value=>({value,label:labels[value]}))]} labels={{...labels,filter:labels.kind}}/>
  <MaterialManager materials={result.materials} courses={courses} labels={labels}/><RecordPagination path={routes.adminTools} query={query} total={result.total} pageSize={p.pageSize} labels={labels}/>
 </>;
}
