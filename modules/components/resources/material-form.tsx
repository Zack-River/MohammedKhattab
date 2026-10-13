"use client";
import {useState} from "react";
import FormField from "@platform/components/ui/form-field";
import TextareaField from "@platform/components/ui/textarea-field";
import Select from "@khatab/design/ui/select";
import SaveFeedback from "@platform/components/admin/save-feedback";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import {endpoints} from "@platform/config/navigation";
import {materialPolicy as p} from "@platform/config/materials";
import {materialFormInput} from "@platform/features/resources/validate-material";
import type {AdminMaterial,MaterialLabels,CourseChoice} from "@platform/types/materials";
import MaterialAssignments from "./material-assignments";
export default function MaterialForm({initial,courses,labels,onClose}:{initial?:AdminMaterial;courses:CourseChoice[];labels:MaterialLabels;onClose:()=>void}) {
 const command=useAdminSave(endpoints.adminResources,labels.error),[assignments,setAssignments]=useState(initial?.assignments ?? []);
 return <form className="lms-profile-form lms-profile-card lms-material-form" onSubmit={event=>{event.preventDefault();void command.save(materialFormInput(new FormData(event.currentTarget),assignments)).then(saved=>{if(saved) onClose();});}}>
  {initial&&<input type="hidden" name="id" value={initial.id}/>}<input type="hidden" name="revision" value={initial?.revision ?? 0}/>
  <fieldset disabled={command.pending}><div className="lms-settings-name-grid"><FormField label={labels.name} name="title" defaultValue={initial?.title} required maxLength={p.titleMax}/><FormField label={labels.type} name="type" defaultValue={initial?.type} required maxLength={p.typeMax}/></div>
   <FormField label={labels.description} name="description" defaultValue={initial?.description} maxLength={p.descriptionMax}/>
   <Select label={labels.kind} name="kind" defaultValue={initial?.kind ?? "text"} options={p.kinds.map(value=>({value,label:labels[value]}))}/>
   <TextareaField label={labels.content} name="content" defaultValue={initial?.content} required maxLength={p.contentMax} rows={6}/>
   <MaterialAssignments courses={courses} value={assignments} onChange={setAssignments} labels={labels}/>
  </fieldset><SaveFeedback {...command} labels={labels}/><button type="button" className="lms-text-link" onClick={onClose} disabled={command.pending}>{labels.cancel}</button>
 </form>;
}
