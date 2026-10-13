import { liveSessionPolicy as policy } from "@platform/config/live-sessions";
function validLocalDate(value:unknown):value is string {
 return typeof value==="string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value+"Z")) && new Date(value+"Z").toISOString().slice(0,16)===value;
}
export function validLiveTiming(value:Record<string,unknown>) {
 if(!validLocalDate(value.startsLocal)||!validLocalDate(value.endsLocal)) return false;
 const duration=Date.parse(value.endsLocal+"Z")-Date.parse(value.startsLocal+"Z");
 return duration>0 && duration<=policy.maxHours*3600000;
}
export function validLiveContent(value:Record<string,unknown>) {
 if(typeof value.title!=="string"||!value.title.trim()||value.title.length>policy.titleMax) return false;
 if(typeof value.description!=="string"||value.description.length>policy.descriptionMax) return false;
 if(typeof value.joinUrl!=="string"||value.joinUrl.length>policy.urlMax) return false;
 try {
  const url=new URL(value.joinUrl);
  return url.protocol==="https:" && !url.username && !url.password;
 }catch{return false;}
}
export function validLiveAssignment(value:Record<string,unknown>) {
 return typeof value.chapterId==="string" && value.chapterId.length<=120
  && typeof value.sectionId==="string" && value.sectionId.length<=120 && Boolean(value.chapterId||!value.sectionId);
}
