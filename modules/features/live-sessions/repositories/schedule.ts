import "server-only";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import type { CourseModule } from "@platform/types/lms";
import { ApiError } from "@platform/lib/api/error";
import { liveSessionColumns, mapLiveSession } from "../helpers/map-session";
export async function readLiveSchedule(slugs: string[]) {
 if(!slugs.length) return {sessions:[],serverNow:new Date().toISOString()};
 const client=await createDatabaseClient();
 const result=await client.from("live_sessions").select(`${liveSessionColumns},courses(title:metadata->>title,modules:metadata->modules)`).in("course_slug",slugs).eq("enabled",true).order("starts_at");
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return {sessions:result.data.map(row=>{
  const chapter=(row.courses?.modules as unknown as CourseModule[] | undefined)?.find(item=>item.id===row.chapter_id);
  const section=chapter?.sections?.find(item=>item.id===row.section_id);
  return {...mapLiveSession(row),courseTitle:String(row.courses?.title ?? ""),assignmentTitle:[chapter?.title,section?.title].filter(Boolean).join(" / ")};
 }),serverNow:new Date().toISOString()};
}
