import "server-only";
import {requireIdentity} from "@platform/features/auth/server/identity";
import {ApiError} from "@platform/lib/api/error";
import type {SavedLessonNote} from "@platform/types/materials";
export async function readLessonNote(slug:string,lessonId:string):Promise<SavedLessonNote> {
 const {client,user}=await requireIdentity();
 const [access,note]=await Promise.all([
  client.from("lessons").select("id,courses!inner(published,enrollments!inner(user_id))").eq("course_slug",slug).eq("id",lessonId).eq("courses.enrollments.user_id",user.id).eq("courses.enrollments.active",true).eq("courses.published",true).maybeSingle(),
  client.from("lesson_notes").select("text,revision").eq("user_id",user.id).eq("course_slug",slug).eq("lesson_id",lessonId).maybeSingle(),
 ]);
 if(access.error||note.error) throw new ApiError(503,"INTERNAL_ERROR");
 if(!access.data) throw new ApiError(403,"FORBIDDEN");return note.data ?? {text:"",revision:0};
}
export async function saveLessonNote(slug:string,lessonId:string,note:SavedLessonNote) {
 const {client}=await requireIdentity();
 const result=await client.rpc("save_lesson_note",{p_slug:slug,p_lesson:lessonId,p_text:note.text,p_revision:note.revision});
 if(result.error) {
  const code=["NOTE_CONFLICT","FORBIDDEN","INVALID_INPUT"].find(code=>result.error!.message.includes(code));
  throw new ApiError(code==="NOTE_CONFLICT" ? 409 : code==="FORBIDDEN" ? 403 : code ? 400 : 503,code ?? "INTERNAL_ERROR");
 }
 return {text:note.text,revision:result.data};
}
