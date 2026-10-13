import Link from "next/link";
import { endpoints,routes } from "@platform/config/navigation";
import { liveSessionState,liveSessionTime } from "@platform/features/live-sessions/helpers/state";
import type { LiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
export default function LiveSessionCard({session,now,joinAllowed,labels}:{session:LiveSession;now:number;joinAllowed:boolean;labels:LiveSessionLabels}) {
 const state=liveSessionState(session,now);
 return <article className="lms-profile-card lms-live-card" data-reveal>
  <Link className="lms-text-link" href={routes.course(session.courseSlug)}>{session.courseTitle}</Link><h3>{session.title}</h3>{session.assignmentTitle && <p className="lms-field-hint">{session.assignmentTitle}</p>}<p>{session.description}</p><strong className={`lms-live-status lms-live-status-${state}`}>{labels[state]}</strong>
  <p><span>{state==="ended" ? labels.endedAt : labels.starts}: </span><time dateTime={state==="ended" ? session.endsAt : session.startsAt}>{liveSessionTime(state==="ended" ? session.endsAt : session.startsAt,session.timezone)}</time></p>
  {state!=="ended" && <p>{labels.ends}: <time dateTime={session.endsAt}>{liveSessionTime(session.endsAt,session.timezone)}</time></p>}
  <small className="lms-field-hint">{session.timezone}</small>
  {state==="active" && (joinAllowed ? <Link href={endpoints.liveJoin(session.courseSlug,session.id)} target="_blank" rel="noopener noreferrer" prefetch={false} className="btn-primary">{labels.join}</Link> : <p className="lms-field-hint">{labels.locked}</p>)}
 </article>;
}
