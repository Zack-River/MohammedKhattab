import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readSales } from "@platform/features/commerce/repositories/sales";
import { salesCopy as labels } from "@platform/data/sales";
import SalesTable from "@platform/components/commerce/admin/sales-table";
import SalesFilters from "@platform/components/commerce/admin/sales-filters";
import AdminPagination from "@platform/components/admin/admin-pagination";
import { routes } from "@platform/config/navigation";
import { commercePolicy } from "@platform/config/commerce";
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string | undefined>>}) {
 await requireAdminPage();const query=await searchParams,search=(query.q ?? '').slice(0,commercePolicy.maxSearch),status=Object.keys(labels.states).includes(query.status ?? '') ? query.status! : 'all',page=Math.min(10000,Math.max(1,Math.floor(Number(query.page)||1)));
 const result=await readSales(search,status,page),href=(page:number)=>routes.adminSales+'?'+new URLSearchParams({q:search,status,page:String(page)});
 return <main className="lms-dashboard-page"><h1>{labels.heading}</h1><SalesFilters {...{labels,search,status}} /><SalesTable records={result.records} labels={labels} /><AdminPagination page={page} previousHref={page>1 ? href(page-1) : undefined} nextHref={page*commercePolicy.pageSize<result.total ? href(page+1) : undefined} labels={{heading:labels.heading,page:'',previous:labels.previous,next:labels.next}} /></main>;
}
