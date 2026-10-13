"use client";
import {useState} from "react";
import Select from "@khatab/design/ui/select";
import TextareaField from "@platform/components/ui/textarea-field";
import AdminDialog from "./admin-dialog";
import SaveFeedback from "./save-feedback";
import AccessDurationFields from "./access-duration-fields";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import {readAccessGrantForm} from "@platform/helpers/access-grant-form";
import {endpoints} from "@platform/config/navigation";
import {enrollmentPolicy} from "@platform/config/enrollment";
import type {EnrollmentLabels} from "@platform/types/enrollment";
import type {AccessChoice} from "@platform/types/access-grant";
export default function AccessGrantForm({userId,courses,bundles,subscriptions,labels,onClose}:{userId:string;courses:{slug:string;title:string}[];bundles:AccessChoice[];subscriptions:{slug:string;revision:number}[];labels:EnrollmentLabels;onClose:()=>void}) {
 const command=useAdminSave(endpoints.adminEnrollments(userId),labels.error),[kind,setKind]=useState("course"),[slug,setSlug]=useState(""),[duration,setDuration]=useState("lifetime"),[invalid,setInvalid]=useState(false);
 const choices=kind==="bundle"?bundles:courses.map(course=>({...course,courseSlugs:[course.slug]}));
 const submit=(form:HTMLFormElement)=>{const grant=readAccessGrantForm(new FormData(form),choices,subscriptions);setInvalid(!grant);if(grant) void command.save({action:"grant",...grant}).then(saved=>{if(saved) onClose();});};
 return <AdminDialog title={labels.freeAccess} closeLabel={labels.cancel} pending={command.pending} onClose={onClose}><form className="lms-profile-form" onSubmit={event=>{event.preventDefault();submit(event.currentTarget);}}>
 <fieldset disabled={command.pending}>
  <Select name="kind" label={labels.productType} value={kind} onValueChange={value=>{setKind(value);setSlug("");}} options={[{value:"course",label:labels.course},{value:"bundle",label:labels.bundle}]}/>
  <Select name="product" label={kind==="bundle"?labels.bundle:labels.course} value={slug} onValueChange={setSlug} placeholder={labels.choose} required options={choices.map(choice=>({value:choice.slug,label:choice.title}))}/>
  <AccessDurationFields {...{duration,labels}} onChange={setDuration}/>
  <TextareaField label={labels.reason} hint={labels.reasonHint} name="reason" required maxLength={enrollmentPolicy.reasonMax} rows={3}/>
 </fieldset><p className="lms-field-hint">{labels.grantHint}</p>
 <SaveFeedback {...command} error={invalid?labels.error:command.error} labels={labels}/>
 </form></AdminDialog>;
}
