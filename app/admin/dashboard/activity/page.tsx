import {requireAdminPage} from "@platform/features/admin/page-identity";
import {readAdminActivity} from "@platform/features/admin/repositories/activity";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import ActivityTable from "@platform/components/admin/activity-table";
import RecordFilters from "@platform/components/admin/record-filters";
import RecordPagination from "@platform/components/admin/record-pagination";
import PageHeading from "@platform/components/ui/page-heading";
import {activityCopy as labels} from "@platform/data/materials";
import {activityEntities} from "@platform/config/materials";
import {recordPolicy} from "@platform/config/records";
import {routes} from "@platform/config/navigation";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 await requireAdminPage();const query=readRecordQuery(await searchParams,activityEntities),result=await readAdminActivity(query);
 return <><PageHeading title={labels.title}/><RecordFilters action={routes.adminActivity} query={query} options={[{value:"all",label:labels.all},...activityEntities.map(value=>({value,label:labels[value]}))]} labels={labels}/><ActivityTable records={result.records} labels={labels}/><RecordPagination path={routes.adminActivity} query={query} total={result.total} pageSize={recordPolicy.pageSize} labels={labels}/></>;
}
