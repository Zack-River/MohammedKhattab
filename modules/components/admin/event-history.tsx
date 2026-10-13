import PageHeading from "@platform/components/ui/page-heading";
import {formatActivityDate} from "@platform/helpers/format-activity-date";
export default function EventHistory({events,labels}:{events:{id:number;title:string;reason:string;actor:string;createdAt:string}[];labels:{title:string;actor:string;unknown:string;empty:string}}) {
 return <section className="lms-account-stack"><PageHeading level={2} title={labels.title}/>
  {events.map(event=><article key={event.id} className="lms-profile-card lms-enrollment-event" data-reveal data-reveal-motion="fade"><h3>{event.title}</h3><p>{event.reason}</p><p>{labels.actor}: {event.actor||labels.unknown}</p><time dateTime={event.createdAt}>{formatActivityDate(event.createdAt)}</time></article>)}
  {!events.length&&<p>{labels.empty}</p>}
 </section>;
}
