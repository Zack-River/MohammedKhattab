import {validRecordRevision} from "@platform/helpers/valid-record-revision";
import {materialPolicy as p} from "@platform/config/materials";
import type {MaterialInput,MaterialAssignment} from "@platform/types/materials";
const segment=(value:unknown):value is string=>typeof value==="string"&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)&&value.length<=160;
export function validateMaterial(value:Record<string,unknown>|null):MaterialInput|null {
 if(!value || (value.id!==undefined&&!segment(value.id)) || !validRecordRevision(value.revision,Boolean(value.id)) || (!value.id&&value.revision!==0)) return null;
 const {title,description,type,content,kind,assignments}=value;
 if(typeof title!=="string"||!title.trim()||title.length>p.titleMax||typeof description!=="string"||description.length>p.descriptionMax||typeof type!=="string"||!type.trim()||type.length>p.typeMax||typeof content!=="string"||!content.trim()||content.length>p.contentMax||!(kind==="text"||kind==="link")) return null;
 if(kind==="link"&&!validMaterialLink(content)) return null;
 if(!Array.isArray(assignments)||assignments.length<1||assignments.length>p.assignmentsMax||!assignments.every(item=>item&&segment(item.courseSlug)&&segment(item.lessonId))) return null;
 if(new Set(assignments.map(item=>`${item.courseSlug}/${item.lessonId}`)).size!==assignments.length) return null;
 return {id:value.id as string|undefined,revision:Number(value.revision),title:title.trim(),description:description.trim(),type:type.trim(),content,kind,assignments:assignments as MaterialAssignment[]};
}
export function validMaterialLink(value:string) {
 try {const url=new URL(value);return url.protocol==="https:"&&!url.username&&!url.password&&!/[\s@]/.test(value)&&Boolean(url.hostname); } catch {return false;}
}
export function materialFormInput(form:FormData,assignments:MaterialAssignment[]) {
 return {id:String(form.get("id") ?? "")||undefined,revision:Number(form.get("revision")),title:form.get("title"),description:form.get("description"),type:form.get("type"),kind:form.get("kind"),content:form.get("content"),assignments};
}
