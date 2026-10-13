import { readLiveSchedule } from "./repositories/schedule";
import LiveSchedule from "@platform/components/live-sessions/schedule";
import { liveSessionCopy } from "@platform/data/live-sessions";
export default async function CourseLiveSchedule({slug,joinAllowed}:{slug:string;joinAllowed:boolean}) {
 const initial=await readLiveSchedule([slug]);
 if(!initial.sessions.length) return null;
 return <LiveSchedule initial={initial} slug={slug} joinAllowed={joinAllowed} labels={liveSessionCopy} />;
}
