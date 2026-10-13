import {readDatabasePage} from "@platform/lib/supabase/read-page";
import {readActorNames} from "@platform/features/admin/repositories/actor-names";
import {validUuid} from "@platform/helpers/validation/uuid";
import "server-only";
import {requireIdentity} from "@platform/features/auth/server/identity";
import {requireAdmin} from "@platform/features/admin/identity";
import {ApiError} from "@platform/lib/api/error";
import {recordSearchPattern} from "@platform/helpers/read-record-query";
import {certificatePolicy} from "@platform/config/certificates";
import type {RecordQuery} from "@platform/types/materials";
export async function listCertificates(query:RecordQuery,admin=false) {
 const {client,user}=await (admin?requireAdmin():requireIdentity()),start=(query.page-1)*certificatePolicy.pageSize;
 let request=client.from("certificates").select("*",{count:"exact"}).order("issued_at",{ascending:false}).order("id").range(start,start+certificatePolicy.pageSize-1);
 if(!admin) request=request.eq("user_id",user.id);
 if(query.search) {const pattern=recordSearchPattern(query.search.replace(/[(),".]/g,""));request=request.or(`learner_name.ilike.${pattern},course_title.ilike.${pattern}`);}
 if(query.filter!=="all") request=request.eq("status",query.filter);
 const result=await readDatabasePage(request);
 return {certificates:result.data,total:result.count};
}
export async function readCertificate(id:string,admin=false) {
 const {client,user}=await (admin?requireAdmin():requireIdentity());
 if(!validUuid(id)) throw new ApiError(404,"NOT_FOUND");
 let request=client.from("certificates").select("*").eq("id",id);
 if(!admin) request=request.eq("user_id",user.id);
 const result=await request.maybeSingle();if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 if(!result.data) throw new ApiError(404,"NOT_FOUND");return result.data;
}

export async function readCertificateEvents(id:string) {
 const {client}=await requireAdmin();if(!validUuid(id)) throw new ApiError(404,"NOT_FOUND");
 const result=await client.from("certificate_events").select("id,action,reason,created_at,actor_id").eq("certificate_id",id).order("created_at",{ascending:false}).order("id",{ascending:false}).limit(certificatePolicy.pageSize);
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");const actors=await readActorNames(result.data.map(row=>row.actor_id));
 return result.data.map(row=>({...row,actor:actors.get(row.actor_id??"")??""}));
}
export async function eligibleCertificateCourses() {
 const {client}=await requireIdentity();const result=await client.rpc("eligible_certificate_courses");
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");return result.data;
}
export async function certificateAccessSlugs() {
 const {client,user}=await requireIdentity();const result=await client.from("enrollments").select("course_slug,courses!inner(published)").eq("user_id",user.id).eq("active",true).eq("courses.published",true);
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");return new Set(result.data.map(row=>row.course_slug));
}
