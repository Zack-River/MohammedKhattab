import EventHistory from "@platform/components/admin/event-history";
import type {CertificateLabels} from "@platform/types/certificates";
export default function CertificateEventHistory({events,labels}:{events:{id:number;action:string;reason:string;created_at:string;actor:string}[];labels:CertificateLabels}) {
 const rows=events.map(event=>({id:event.id,title:event.action==="issue"?labels.issue:event.action==="revoke"?labels.revoke:labels.restore,reason:event.reason,createdAt:event.created_at,actor:event.actor}));
 return <EventHistory events={rows} labels={{title:labels.history,actor:labels.actor,unknown:labels.unknown,empty:labels.empty}}/>;
}
