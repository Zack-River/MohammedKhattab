import { liveSessionPolicy as policy } from "@platform/config/live-sessions";
import { validLiveTiming,validLiveContent,validLiveAssignment } from "./validate-fields";
import type { LiveSessionInput } from "@platform/types/live-sessions";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const validSessionId=(value:unknown):value is string=>typeof value==="string"&&uuid.test(value);
export function validateLiveSession(value: Record<string,unknown> | null): LiveSessionInput | null {
 if(!value || (value.id!==undefined&&!validSessionId(value.id))) return null;
 if(!Number.isSafeInteger(value.revision)||Number(value.revision)<0) return null;
 if(typeof value.courseSlug!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.courseSlug)||value.courseSlug.length>120) return null;
 if(!validLiveContent(value)||!validLiveTiming(value)||!validLiveAssignment(value)) return null;
 if(typeof value.timezone!=="string"||!policy.timezones.some(zone=>zone===value.timezone)||typeof value.enabled!=="boolean") return null;
 return {...value,title:(value.title as string).trim()} as unknown as LiveSessionInput;
}
export function readLiveSessionForm(form: FormData): Record<string,unknown> {
 return {...Object.fromEntries(form),revision:Number(form.get("revision")),enabled:form.get("enabled")==="on"};
}
