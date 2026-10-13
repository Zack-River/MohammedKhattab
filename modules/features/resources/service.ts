import {readDatabasePage} from "@platform/lib/supabase/read-page";
import {requireIdentity} from "@platform/features/auth/server/identity";
import {ApiError} from "@platform/lib/api/error";
import {materialPolicy} from "@platform/config/materials";
import {recordSearchPattern} from "@platform/helpers/read-record-query";
import type {RecordQuery} from "@platform/types/materials";
export async function listResources(query:RecordQuery={search:"",filter:"all",page:1}) {
 const {client}=await requireIdentity(),start=(query.page-1)*materialPolicy.pageSize;
 let request=client.from("resources").select("id,title,description,type",{count:"exact"}).order("updated_at",{ascending:false}).order("id").range(start,start+materialPolicy.pageSize-1);
 if(query.search) request=request.ilike("title",recordSearchPattern(query.search));
 if(query.filter!=="all") request=request.eq("kind",query.filter);
 const result=await readDatabasePage(request);
 return {resources:result.data,total:result.count};
}
export async function readResource(id:string) {
 const {client}=await requireIdentity();
 const {data,error}=await client.from("resources").select("id,content,kind").eq("id",id).maybeSingle();
 if(error) throw new ApiError(503,"INTERNAL_ERROR");
 if(!data) throw new ApiError(404,"NOT_FOUND");return data;
}
