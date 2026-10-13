import PageHeading from "@platform/components/ui/page-heading";
import {formatActivityDate} from "@platform/helpers/format-activity-date";
import type {EnrollmentEvent,EnrollmentLabels} from "@platform/types/enrollment";
export default function EnrollmentHistory({events,courses,labels}:{events:EnrollmentEvent[];courses:{slug:string;title:string}[];labels:EnrollmentLabels}) {
 return <section className="lms-account-stack"><PageHeading level={2} title={labels.history}/>
  {events.map(event=><article key={event.id} className="lms-profile-card lms-enrollment-event" data-reveal data-reveal-motion="fade"><h3>{labels[event.action]} · {courses.find(course=>course.slug===event.course_slug)?.title ?? event.course_slug}</h3><p>{event.reason}</p><p>{labels.actor}: {event.actor || labels.system}</p><time dateTime={event.created_at}>{formatActivityDate(event.created_at)}</time></article>)}
  {!events.length&&<p>{labels.empty}</p>}
 </section>;
}
