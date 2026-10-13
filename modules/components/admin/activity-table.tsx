import Link from "next/link";
import {routes} from "@platform/config/navigation";
import {formatActivityDate} from "@platform/helpers/format-activity-date";
import type {ActivityLabels,ActivityRecord} from "@platform/types/admin-activity";
export default function ActivityTable({records,labels}:{records:ActivityRecord[];labels:ActivityLabels}) {
 const entity=(value:string)=>labels[value as keyof ActivityLabels] ?? value;
 return <div className="lms-admin-table-wrap" data-reveal data-reveal-motion="fade"><table className="lms-admin-table lms-activity-table"><caption className="lms-visually-hidden">{labels.title}</caption><thead><tr>{[labels.date,labels.actor,labels.entity,labels.target,labels.action].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>
  {records.map(record=><tr key={record.id}><td data-label={labels.date}><time dateTime={record.created_at}>{formatActivityDate(record.created_at)}</time></td><td data-label={labels.actor}>{record.actor ? <Link className="lms-text-link" href={routes.adminUser(record.actor.username)}>{record.actor.name}</Link> : record.actor_id ? labels.unknown : labels.system}</td><td data-label={labels.entity}>{entity(record.entity)}</td><td data-label={labels.target}><bdi>{record.target}</bdi>{record.changed_fields.length>0&&<small>{labels.fields}: {record.changed_fields.join(", ")}</small>}</td><td data-label={labels.action}>{entity(record.action)}</td></tr>)}
 </tbody></table>{!records.length&&<p className="lms-admin-empty">{labels.empty}</p>}</div>;
}
