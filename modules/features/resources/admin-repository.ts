import {readDatabasePage} from "@platform/lib/supabase/read-page";
import "server-only";
import {requireAdmin} from "@platform/features/admin/identity";
import {ApiError} from "@platform/lib/api/error";
import {materialPolicy} from "@platform/config/materials";
import {recordSearchPattern} from "@platform/helpers/read-record-query";
import type {AdminMaterial,MaterialInput,RecordQuery} from "@platform/types/materials";
import type {Json} from "@platform/types/database";
export async function readAdminMaterials(query:RecordQuery) {
 const {client}=await requireAdmin(),start=(query.page-1)*materialPolicy.pageSize;
 let request=client.from("resources").select("*,lesson_resources(course_slug,lesson_id)",{count:"exact"}).order("updated_at",{ascending:false}).order("id").range(start,start+materialPolicy.pageSize-1);
 if(query.search) request=request.ilike("title",recordSearchPattern(query.search));
 if(query.filter!=="all") request=request.eq("kind",query.filter);
 const result=await readDatabasePage(request);
 const materials:AdminMaterial[]=result.data.map(row=>({id:row.id,title:row.title,description:row.description,type:row.type,kind:row.kind as "text"|"link",content:row.content,revision:row.revision,createdAt:row.created_at,updatedAt:row.updated_at,assignments:row.lesson_resources.map(link=>({courseSlug:link.course_slug,lessonId:link.lesson_id}))}));
 return {materials,total:result.count};
}
export async function mutateMaterial(input:MaterialInput|{id:string;revision:number},remove=false) {
 const {client}=await requireAdmin();
 const result=remove ? await client.rpc("delete_admin_material",{p_id:input.id!,p_revision:input.revision}) : await client.rpc("save_admin_material",{p_input:input as unknown as Json});
 if(result.error) {
  const code=["MATERIAL_CONFLICT","INVALID_INPUT","NOT_FOUND","FORBIDDEN"].find(code=>result.error!.message.includes(code));
  throw new ApiError(code==="MATERIAL_CONFLICT" ? 409 : code==="NOT_FOUND" ? 404 : code==="FORBIDDEN" ? 403 : code ? 400 : 503,code ?? "INTERNAL_ERROR");
 }
 return {saved:true};
}
