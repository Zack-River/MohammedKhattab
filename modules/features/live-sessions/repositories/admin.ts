import {readDatabasePage} from "@platform/lib/supabase/read-page";
import "server-only";
import { liveSessionPolicy } from "@platform/config/live-sessions";
import { readLiveQuery } from "../helpers/read-query";
import { requireAdmin } from "@platform/features/admin/identity";
import { ApiError } from "@platform/lib/api/error";
import { mapLiveSession } from "../helpers/map-session";
import type { AdminLiveSession,LiveSessionInput } from "@platform/types/live-sessions";
import type { Json } from "@platform/types/database";
export async function readAdminLiveSessions(query:ReturnType<typeof readLiveQuery>) {
 const {client}=await requireAdmin();
 const now=new Date().toISOString(),start=(query.page-1)*liveSessionPolicy.pageSize;
 let request=client.from("live_sessions").select("*,live_session_links(join_url)",{count:"exact"}).order("starts_at",{ascending:false}).order("id").range(start,start+liveSessionPolicy.pageSize-1);
 if(query.search) request=request.ilike("title",`%${query.search.replace(/[%_\\]/g,"")}%`);
 if(query.status==="upcoming") request=request.gt("starts_at",now);
 if(query.status==="active") request=request.lte("starts_at",now).gt("ends_at",now);
 if(query.status==="ended") request=request.lte("ends_at",now);
 const result=await readDatabasePage(request);
 const sessions:AdminLiveSession[]=result.data.map(row=>({...mapLiveSession(row),enabled:row.enabled,revision:row.revision,joinUrl:row.live_session_links?.join_url ?? ""}));
 return {sessions,total:result.count,serverNow:now};
}
export async function mutateLiveSession(input:LiveSessionInput | {id:string;revision:number},remove=false) {
 const {client}=await requireAdmin();
 const result=remove ? await client.rpc("delete_live_session",{p_id:input.id!,p_revision:input.revision}) : await client.rpc("save_live_session",{p_input:input as unknown as Json});
 if(result.error) {
  const code=["COURSE_CONFLICT","INVALID_INPUT","NOT_FOUND","FORBIDDEN"].find(code=>result.error!.message.includes(code));
  throw new ApiError(code==="COURSE_CONFLICT" ? 409 : code==="NOT_FOUND" ? 404 : code==="FORBIDDEN" ? 403 : code ? 400 : 503,code ?? "INTERNAL_ERROR");
 }
 return {saved:true};
}
