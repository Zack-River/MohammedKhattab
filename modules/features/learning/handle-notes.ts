import {validRecordRevision} from "@platform/helpers/valid-record-revision";
import {readLessonNote,saveLessonNote} from "./repositories/lesson-notes";
import {requireIdentity} from "@platform/features/auth/server/identity";
import {apiResponse} from "@platform/lib/api/respond";
import {ApiError} from "@platform/lib/api/error";
import {readJson,sameOrigin} from "@platform/lib/server-request";
import {notePolicy} from "@platform/config/materials";
export function handleLessonNotes(request:Request,{params}:{params:Promise<{slug:string;lessonId:string}>}) {
 return apiResponse(async()=>{
  await requireIdentity();const {slug,lessonId}=await params;
  if(request.method==="GET") return Response.json(await readLessonNote(slug,lessonId));
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const body=await readJson(request);
  if(typeof body?.text!=="string"||body.text.length>notePolicy.textMax||!validRecordRevision(body.revision,false)) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await saveLessonNote(slug,lessonId,{text:body.text,revision:Number(body.revision)}));
 });
}
