import {httpRequest} from "@platform/lib/http-request";
import type {SavedLessonNote} from "@platform/types/materials";
export function saveRemoteNote(path:string,note:SavedLessonNote,error:string) {
 return httpRequest({path,body:note,failureLabel:error,decode:(value:unknown):SavedLessonNote=>{
  if(!value||typeof value!=="object"||!("text" in value)||!("revision" in value)||typeof value.text!=="string"||!Number.isSafeInteger(value.revision)||Number(value.revision)<1) throw new Error(error);
  return {text:value.text,revision:Number(value.revision)};
 }});
}
