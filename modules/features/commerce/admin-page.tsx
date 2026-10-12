import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readCommerceTargets } from "./repositories/targets";
import { readCommerceList } from "./repositories/admin-records";
import { commerceCopy as labels } from "@platform/data/commerce";
import { routes } from "@platform/config/navigation";
import { adminUsersCopy } from "@platform/data/admin-users";
import ManageCommerceRecords from "@platform/components/commerce/admin/manage-records";
import CommerceFilters from "@platform/components/commerce/admin/filters";
import CommerceTabs from "@platform/components/commerce/admin/tabs";
import AdminPagination from "@platform/components/admin/admin-pagination";
import type { CommerceKind } from "@platform/types/commerce";
export default async function CommerceAdminPage({kind,query}:{kind:CommerceKind;query:Record<string,string | string[] | undefined>}) {
 await requireAdminPage();
 const search=typeof query.q==='string' ? query.q.slice(0,100) : '',status=['active','inactive'].includes(String(query.status)) ? String(query.status) : 'all',page=Math.min(10000,Math.max(1,Math.floor(Number(query.page)||1)));
 const [result,options]=await Promise.all([readCommerceList(kind,search,status,page),readCommerceTargets()]);
 const choices=options.courses,targets=[...choices.map(course=>({value:`course:${course.slug}`,label:`${labels.course}: ${course.title}`})),...options.bundles.map(bundle=>({value:`bundle:${bundle.slug}`,label:`${labels.bundle}: ${bundle.title}`}))];
 const href=(page:number)=>routes.adminCommerce(kind)+'?'+new URLSearchParams({q:search,status,page:String(page)});
 return <main className="lms-dashboard-page"><h1>{labels.title}</h1><CommerceTabs {...{kind,labels}} /><CommerceFilters {...{kind,labels,search,status}} />
 <ManageCommerceRecords kind={kind} records={result.records} labels={labels} courses={choices} targets={targets} closeLabel={adminUsersCopy.close} />
 <AdminPagination page={page} previousHref={page>1 ? href(page-1) : undefined} nextHref={page*5<result.total ? href(page+1) : undefined} labels={{heading:labels.title,previous:labels.previous,next:labels.next,page:''}} /></main>;
}
