import "server-only";
import {requireAdmin} from "../identity";
import {createAuthAdministrator} from "@platform/lib/supabase/admin";
import {ApiError} from "@platform/lib/api/error";
import {recordPolicy} from "@platform/config/records";
import {recordSearchPattern} from "@platform/helpers/read-record-query";
import type {RecordQuery} from "@platform/types/materials";
export async function readAdminActivity(query:RecordQuery) {
 const {client}=await requireAdmin(),start=(query.page-1)*recordPolicy.pageSize;
 let request=client.from("admin_activity").select("*",{count:"exact"}).order("created_at",{ascending:false}).order("id",{ascending:false}).range(start,start+recordPolicy.pageSize-1);
 if(query.search) request=request.ilike("target",recordSearchPattern(query.search));
 if(query.filter!=="all") request=request.eq("entity",query.filter);
 const result=await request;if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 const ids=[...new Set(result.data.flatMap(row=>row.actor_id ? [row.actor_id] : []))];
 const profiles=ids.length ? await createAuthAdministrator().from("profiles").select("id,name,username").in("id",ids) : {data:[],error:null};
 if(profiles.error) throw new ApiError(503,"INTERNAL_ERROR");
 return {records:result.data.map(row=>({...row,actor:profiles.data?.find(profile=>profile.id===row.actor_id) ?? null})),total:result.count ?? 0};
}
