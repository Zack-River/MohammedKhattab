"use client";
import { useScheduleClock } from "@platform/hooks/live-sessions/use-schedule-clock";
import LiveSessionCard from "./session-card";
import type { LiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
export default function LiveSchedule({initial,slug,joinAllowed,labels}:{initial:{sessions:LiveSession[];serverNow:string};slug?:string;joinAllowed:boolean;labels:LiveSessionLabels}) {
 const {sessions,now}=useScheduleClock(initial,slug);
 return <section className="lms-live-schedule" aria-label={labels.title}><h2>{labels.title}</h2><p className="lms-field-hint">{labels.scheduleHint}</p>
  <div className="lms-live-grid">{sessions.map(session=><LiveSessionCard key={session.id} {...{session,now,joinAllowed,labels}} />)}</div>
  {!sessions.length && <p className="lms-field-hint">{labels.empty}</p>}
 </section>;
}
