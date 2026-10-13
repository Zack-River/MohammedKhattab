"use client";
import AdminDialog from "@platform/components/admin/admin-dialog";
import TextareaField from "@platform/components/ui/textarea-field";
import SaveFeedback from "@platform/components/admin/save-feedback";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import {certificatePolicy} from "@platform/config/certificates";
import type {CertificateRecord,CertificateLabels} from "@platform/types/certificates";
export default function CertificateModerationDialog({record,labels,endpoint,onClose}:{record:CertificateRecord;labels:CertificateLabels;endpoint:string;onClose:()=>void}) {
 const command=useAdminSave(endpoint,labels.error),operation=record.status==="issued"?"revoke":"restore";
 return <AdminDialog title={labels[operation]} closeLabel={labels.cancel} pending={command.pending} onClose={onClose}>
  <form className="lms-profile-form" onSubmit={event=>{event.preventDefault();void command.save({operation,id:record.id,revision:record.revision,reason:new FormData(event.currentTarget).get("reason")}).then(saved=>{if(saved) onClose();});}}>
   <p>{record.learner_name} — {record.course_title}</p><TextareaField name="reason" label={labels.reason} required maxLength={certificatePolicy.reasonMax} disabled={command.pending}/><SaveFeedback {...command} labels={labels}/>
  </form>
 </AdminDialog>;
}
