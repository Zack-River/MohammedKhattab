import "server-only";
import { requireAdmin } from "@platform/features/admin/identity";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commercePolicy } from "@platform/config/commerce";
import { commerceDatabaseError } from "../helpers/database-error";
import type { SaleRecord } from "@platform/types/sales";
export async function readSales(search:string,status:string,page:number) {
 await requireAdmin();
 const client=createAuthAdministrator(),start=(page-1)*commercePolicy.pageSize;
 let query=client.from('payment_orders').select('id,course_title,amount_minor,created_at,paid_at,status,live,user_id,bundle_slug,pricing_snapshot',{count:'exact'}).order('created_at',{ascending:false}).order('id').range(start,start+commercePolicy.pageSize-1);
 if(search) query=query.ilike('course_title',`%${search.replace(/[%_\\]/g,'')}%`);
 if(status!=='all') query=query.eq('status',status);
 const result=await query;if(result.error) commerceDatabaseError(result.error);
 const ids=(result.data ?? []).flatMap(row=>row.user_id ? [row.user_id] : []);
 const profiles=ids.length ? await client.from('profiles').select('id,name,username').in('id',ids) : {data:[],error:null};
 if(profiles.error) commerceDatabaseError(profiles.error);
 const records:SaleRecord[]=(result.data ?? []).map(row=>{
  const profile=profiles.data?.find(profile=>profile.id===row.user_id),snapshot=row.pricing_snapshot;
  const price=snapshot && typeof snapshot==='object' && !Array.isArray(snapshot) ? snapshot : {};
  return {id:row.id,title:row.course_title,amountMinor:row.amount_minor,createdAt:row.created_at,paidAt:row.paid_at,status:row.status,live:row.live,username:profile?.username ?? null,name:profile?.name ?? '',bundle:Boolean(row.bundle_slug),couponCode:typeof price.couponCode==='string' ? price.couponCode : null,discountMinor:Number(price.offerMinor ?? 0)+Number(price.couponMinor ?? 0)};
 });
 return {records,total:result.count ?? 0,page};
}
