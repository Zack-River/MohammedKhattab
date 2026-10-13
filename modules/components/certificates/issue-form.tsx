"use client";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
import FormField from "@platform/components/ui/form-field";
import Select from "@khatab/design/ui/select";
import SaveFeedback from "@platform/components/admin/save-feedback";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import type {CertificateLabels} from "@platform/types/certificates";
import {usernamePolicy} from "@platform/helpers/validation/username";
export default function CertificateIssueForm({courses,labels,endpoint,admin=false}:{courses:{slug:string;title:string}[];labels:CertificateLabels;endpoint:string;admin?:boolean}) {
 const command=useAdminSave(endpoint,labels.error),hydrated=useHydrated();
 return <form className="lms-profile-form lms-profile-card" onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);void command.save({operation:"issue",slug:data.get("slug"),...(admin?{username:data.get("username")}:{} )});}}>
  <h2>{admin?labels.issue:labels.request}</h2><p className="lms-field-hint">{labels.issueHint}</p>
  <fieldset disabled={!hydrated||command.pending||!courses.length} className="lms-settings-name-grid">
   {admin&&<FormField label={labels.username} name="username" required minLength={usernamePolicy.min} maxLength={usernamePolicy.max} dir="ltr" autoComplete="off"/>}
   <Select name="slug" label={labels.course} required options={courses.map(course=>({value:course.slug,label:course.title}))} defaultValue={courses[0]?.slug}/>
  </fieldset>{courses.length?<SaveFeedback {...command} pending={!hydrated||command.pending} labels={{...labels,save:admin?labels.issue:labels.request}}/>:<p>{labels.empty}</p>}
 </form>;
}
