import EventHistory from "./event-history";
import {formatActivityDate} from "@platform/helpers/format-activity-date";
import type {EnrollmentEvent,EnrollmentLabels} from "@platform/types/enrollment";
export default function EnrollmentHistory({events,courses,labels}:{events:EnrollmentEvent[];courses:{slug:string;title:string}[];labels:EnrollmentLabels}) {
 const rows=events.map(event=>({id:event.id,title:labels[event.action]+" · "+(courses.find(course=>course.slug===event.course_slug)?.title??event.course_slug),reason:[event.reason,event.action==="grant"&&(event.access_expires_at?`${labels.expires} ${formatActivityDate(event.access_expires_at)}`:labels.lifetime),event.bundle_slug&&`${labels.bundle}: ${event.bundle_slug}`].filter(Boolean).join(" · "),actor:event.actor,createdAt:event.created_at}));
 return <EventHistory events={rows} labels={{title:labels.history,actor:labels.actor,unknown:labels.system,empty:labels.empty}}/>;
}
