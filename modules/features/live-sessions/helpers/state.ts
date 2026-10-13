import type { LiveSession, LiveSessionState } from "@platform/types/live-sessions";
export function liveSessionState(session: Pick<LiveSession,"startsAt"|"endsAt">, now: number): LiveSessionState {
 if (now >= Date.parse(session.endsAt)) return "ended";
 return now >= Date.parse(session.startsAt) ? "active" : "upcoming";
}
export function liveSessionTime(value: string, timezone: string) {
 return new Intl.DateTimeFormat("ar-EG", {timeZone:timezone,dateStyle:"medium",timeStyle:"short"}).format(new Date(value));
}
export function liveSessionDateInput(value: string, timezone: string) {
 const parts = new Intl.DateTimeFormat("en-CA",{timeZone:timezone,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(value));
 const part=(key:string)=>parts.find(item=>item.type===key)?.value;
 return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
