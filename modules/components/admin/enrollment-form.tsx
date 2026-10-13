"use client";
import {useState} from "react";
import Select from "@khatab/design/ui/select";
import TextareaField from "@platform/components/ui/textarea-field";
import AdminDialog from "./admin-dialog";
import SaveFeedback from "./save-feedback";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import {endpoints} from "@platform/config/navigation";
import {enrollmentPolicy} from "@platform/config/enrollment";
import type {EnrollmentChange,EnrollmentLabels} from "@platform/types/enrollment";
export default function EnrollmentForm({userId,initial,courses,labels,onClose}:{userId:string;initial:Omit<EnrollmentChange,"reason">;courses:{slug:string;title:string}[];labels:EnrollmentLabels;onClose:()=>void}) {
 const command=useAdminSave(endpoints.adminEnrollments(userId),labels.error),[slug,setSlug]=useState(initial.courseSlug);
 return <AdminDialog title={labels[initial.action]} closeLabel={labels.cancel} pending={command.pending} onClose={onClose}><form className="lms-profile-form" onSubmit={event=>{event.preventDefault();const reason=String(new FormData(event.currentTarget).get("reason") ?? "");void command.save({...initial,courseSlug:slug,reason}).then(saved=>{if(saved) onClose();});}}>
  <fieldset disabled={command.pending}>
   {initial.action==="grant" ? <Select name="course" label={labels.course} value={slug} onValueChange={setSlug} required placeholder={labels.choose} options={courses.map(course=>({value:course.slug,label:course.title}))}/> : <p>{courses.find(course=>course.slug===slug)?.title ?? slug}</p>}
   <TextareaField label={labels.reason} hint={labels.reasonHint} name="reason" required maxLength={enrollmentPolicy.reasonMax} rows={4}/>
  </fieldset><p>{labels.hint}</p><SaveFeedback {...command} labels={labels}/>
 </form></AdminDialog>;
}
