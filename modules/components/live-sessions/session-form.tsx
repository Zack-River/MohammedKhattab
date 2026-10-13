"use client";
import { useState } from "react";
import FormField from "@platform/components/ui/form-field";
import Select from "@khatab/design/ui/select";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import SaveFeedback from "@platform/components/admin/save-feedback";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { endpoints } from "@platform/config/navigation";
import { liveSessionPolicy as policy } from "@platform/config/live-sessions";
import { liveSessionDateInput } from "@platform/features/live-sessions/helpers/state";
import { readLiveSessionForm } from "@platform/features/live-sessions/helpers/validate-input";
import type { AdminLiveSession,LiveSessionLabels } from "@platform/types/live-sessions";
import SessionAssignment,{type SessionCourseChoice} from "./session-assignment";
export default function SessionForm({initial,courses,labels,onClose}:{initial?:AdminLiveSession;courses:SessionCourseChoice[];labels:LiveSessionLabels;onClose:()=>void}) {
 const command=useAdminSave(endpoints.adminLiveSessions,labels.error),[timezone,setTimezone]=useState(initial?.timezone ?? policy.defaultTimezone);
 return <form className="lms-profile-form lms-profile-card lms-live-form" onSubmit={event=>{event.preventDefault();void command.save(readLiveSessionForm(new FormData(event.currentTarget))).then(saved=>{if(saved) onClose();});}}>
  {initial && <input type="hidden" name="id" value={initial.id} />}<input type="hidden" name="revision" value={initial?.revision ?? 0} />
  <fieldset disabled={command.pending}><SessionAssignment {...{initial,courses,labels}} />
   <FormField label={labels.name} name="title" defaultValue={initial?.title} maxLength={policy.titleMax} required />
   <FormField label={labels.description} name="description" defaultValue={initial?.description ?? ""} maxLength={policy.descriptionMax} />
   <Select label={labels.timezone} name="timezone" value={timezone} onValueChange={setTimezone} options={policy.timezones.map(value=>({value,label:value}))} />
   <div className="lms-settings-name-grid"><FormField label={labels.starts} name="startsLocal" type="datetime-local" defaultValue={initial ? liveSessionDateInput(initial.startsAt,initial.timezone) : ""} required /><FormField label={labels.ends} name="endsLocal" type="datetime-local" defaultValue={initial ? liveSessionDateInput(initial.endsAt,initial.timezone) : ""} required /></div>
   <p className="lms-field-hint">{labels.timezoneHint}</p><FormField label={labels.joinUrl} name="joinUrl" type="url" dir="ltr" defaultValue={initial?.joinUrl} maxLength={policy.urlMax} required />
   <Checkbox name="enabled" label={labels.enabled} defaultChecked={initial?.enabled ?? true} />
  </fieldset>
  <SaveFeedback {...command} labels={{save:labels.save,saving:labels.saving,saved:labels.saved}} /><button type="button" className="lms-text-link" disabled={command.pending} onClick={onClose}>{labels.cancel}</button>
 </form>;
}
