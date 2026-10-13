import EventHistory from "./event-history";
import type {EnrollmentEvent,EnrollmentLabels} from "@platform/types/enrollment";
export default function EnrollmentHistory({events,courses,labels}:{events:EnrollmentEvent[];courses:{slug:string;title:string}[];labels:EnrollmentLabels}) {
 const rows=events.map(event=>({id:event.id,title:labels[event.action]+" · "+(courses.find(course=>course.slug===event.course_slug)?.title??event.course_slug),reason:event.reason,actor:event.actor,createdAt:event.created_at}));
 return <EventHistory events={rows} labels={{title:labels.history,actor:labels.actor,unknown:labels.system,empty:labels.empty}}/>;
}
