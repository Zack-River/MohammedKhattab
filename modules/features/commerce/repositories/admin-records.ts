import "server-only";
import { requireAdmin } from "@platform/features/admin/identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
import { readBundleRecord,readDiscountRecord } from "../helpers/read-record";
import { commerceSearchFilter } from "../helpers/search-filter";
import { commercePolicy } from "@platform/config/commerce";
import type { CommerceKind, CommerceList } from "@platform/types/commerce";
export async function readCommerceList(kind:CommerceKind, search="", status="all", page=1): Promise<CommerceList> {
 await requireAdmin();
 const client=createAuthAdministrator(),from=(page-1)*commercePolicy.pageSize;
 if(kind==='bundles') {
  let query=client.from('commerce_bundles').select('*',{count:'exact'}).order('updated_at',{ascending:false}).order('slug').range(from,from+commercePolicy.pageSize-1);
  if(search) query=query.or(commerceSearchFilter(search,'slug'));
  if(status!=='all') query=query.eq('enabled',status==='active');
  const result=await query;if(result.error) commerceDatabaseError(result.error);
  const slugs=(result.data ?? []).map(row=>row.slug);
  const members=slugs.length ? await client.from('commerce_bundle_courses').select('bundle_slug,course_slug').in('bundle_slug',slugs).order('position') : {data:[],error:null};
  if(members.error) commerceDatabaseError(members.error);
  return {records:(result.data ?? []).map(row=>readBundleRecord(row,(members.data ?? []).filter(item=>item.bundle_slug===row.slug).map(item=>item.course_slug))),total:result.count ?? 0,page};
 }
 let query=client.from('commerce_discounts').select('*',{count:'exact'}).eq('kind',kind).order('updated_at',{ascending:false}).order('key').range(from,from+commercePolicy.pageSize-1);
 if(search) query=query.or(commerceSearchFilter(search,'key'));
 if(status!=='all') query=query.eq('enabled',status==='active');
 const result=await query;if(result.error) commerceDatabaseError(result.error);
 return {records:(result.data ?? []).map(readDiscountRecord),total:result.count ?? 0,page};
}
