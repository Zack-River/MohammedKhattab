import { requireIdentity } from "@platform/features/auth/server/identity";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { validSessionId } from "./helpers/validate-input";
import { liveSessionState } from "./helpers/state";
export function handleLiveJoin(slug:string,id:string) {
 return apiResponse(async()=>{
  const {client}=await requireIdentity();if(!validSessionId(id)) throw new ApiError(404,"NOT_FOUND");
  const result=await client.from("live_sessions").select("starts_at,ends_at").eq("id",id).eq("course_slug",slug).eq("enabled",true).maybeSingle();
  if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
  if(!result.data) throw new ApiError(404,"NOT_FOUND");
  if(liveSessionState({startsAt:result.data.starts_at,endsAt:result.data.ends_at},Date.now())!=="active") throw new ApiError(403,"FORBIDDEN");
  const link=await client.from("live_session_links").select("join_url").eq("session_id",id).maybeSingle();
  if(link.error) throw new ApiError(503,"INTERNAL_ERROR");
  if(!link.data || Date.now()>=Date.parse(result.data.ends_at)) throw new ApiError(403,"FORBIDDEN");
  return new Response(null,{status:302,headers:{Location:link.data.join_url,"Cache-Control":"private, no-store","Referrer-Policy":"no-referrer"}});
 });
}
