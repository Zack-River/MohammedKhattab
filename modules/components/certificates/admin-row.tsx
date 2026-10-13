"use client";
import {useState} from "react";
import CertificateModerationDialog from "./moderation-dialog";
import {formatActivityDate} from "@platform/helpers/format-activity-date";
import {endpoints,routes} from "@platform/config/navigation";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
import type {CertificateRecord,CertificateLabels} from "@platform/types/certificates";
export default function CertificateAdminRow({record,labels}:{record:CertificateRecord;labels:CertificateLabels}) {
 const [editing,setEditing]=useState(false),hydrated=useHydrated();
 return <tr><td data-label={labels.learner}>{record.learner_name}</td><td data-label={labels.course}>{record.course_title}</td><td data-label={labels.date}>{formatActivityDate(record.issued_at)}</td><td data-label={labels.serial}><span dir="ltr" className="lms-record-id">{record.id}</span></td><td data-label={labels.filter}>{record.status==="issued"?labels.issued:labels.revoked}</td>
  <td data-label={labels.actions}><div className="lms-admin-actions"><a className="lms-text-link" href={routes.adminCertificate(record.id)}>{labels.preview}</a><button type="button" className="lms-text-link" disabled={!hydrated} onClick={()=>setEditing(true)}>{record.status==="issued"?labels.revoke:labels.restore}</button></div>
   {editing&&<CertificateModerationDialog {...{record,labels}} endpoint={endpoints.adminCertificates} onClose={()=>setEditing(false)}/>}
  </td></tr>;
}
