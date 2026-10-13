import type { Database } from "@platform/types/database";
import type { LiveSession } from "@platform/types/live-sessions";
type Row=Database["public"]["Tables"]["live_sessions"]["Row"];
export const liveSessionColumns="id,course_slug,title,description,starts_at,ends_at,timezone,chapter_id,section_id";
export function mapLiveSession(row: Pick<Row,"id"|"course_slug"|"title"|"description"|"starts_at"|"ends_at"|"timezone"|"chapter_id"|"section_id">):LiveSession {
 return {id:row.id,courseSlug:row.course_slug,title:row.title,description:row.description,startsAt:row.starts_at,endsAt:row.ends_at,timezone:row.timezone,chapterId:row.chapter_id,sectionId:row.section_id};
}
