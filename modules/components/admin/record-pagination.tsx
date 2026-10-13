import AdminPagination from "./admin-pagination";
import {recordPageHref} from "@platform/helpers/read-record-query";
import type {RecordQuery} from "@platform/types/materials";
export default function RecordPagination({path,query,total,pageSize,labels}:{path:string;query:RecordQuery;total:number;pageSize:number;labels:{title:string;previous:string;next:string}}) {
 return <AdminPagination page={query.page} previousHref={query.page>1 ? recordPageHref(path,query,query.page-1) : undefined} nextHref={query.page*pageSize<total ? recordPageHref(path,query,query.page+1) : undefined} labels={{heading:labels.title,previous:labels.previous,next:labels.next,page:""}}/>;
}
