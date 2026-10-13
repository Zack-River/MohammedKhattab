import {requirePageIdentity} from "@platform/features/auth/server/page-identity";
import ResourceCard from "@platform/components/resources/resource-card";
import RecordFilters from "@platform/components/admin/record-filters";
import RecordPagination from "@platform/components/admin/record-pagination";
import PageHeading from "@platform/components/ui/page-heading";
import {listResources} from "@platform/features/resources/service";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {materialPolicy as p} from "@platform/config/materials";
import {materialCopy as labels} from "@platform/data/materials";
import {copy} from "@platform/data/site";
import {routes} from "@platform/config/navigation";
export default async function ResourcePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 await requirePageIdentity();const query=readRecordQuery(await searchParams,p.kinds),result=await listResources(query);
 return <><PageHeading title={copy.resources}/><RecordFilters action={routes.resources} query={query} options={[{value:"all",label:labels.all},...p.kinds.map(value=>({value,label:labels[value]}))]} labels={{...labels,filter:labels.kind}}/>
  <div className="lms-resource-grid">{result.resources.map(resource=><ResourceCard key={resource.id} copy={{download:copy.download}} resource={resource}/>)}</div>
  {!result.resources.length&&<p className="lms-admin-empty">{labels.empty}</p>}<RecordPagination path={routes.resources} query={query} total={result.total} pageSize={p.pageSize} labels={labels}/>
 </>;
}
