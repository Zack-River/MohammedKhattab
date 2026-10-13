"use client";
import {useState} from "react";
import AdminDialog from "@platform/components/admin/admin-dialog";
import SaveFeedback from "@platform/components/admin/save-feedback";
import {useAdminSave} from "@platform/hooks/use-admin-save";
import {endpoints} from "@platform/config/navigation";
import {formatCourseDate} from "@platform/helpers/format-course-date";
import type {AdminMaterial,MaterialLabels} from "@platform/types/materials";
export default function MaterialRow({material,labels,onEdit}:{material:AdminMaterial;labels:MaterialLabels;onEdit:()=>void}) {
 const [removing,setRemoving]=useState(false),command=useAdminSave(endpoints.adminResources,labels.error);
 return <tr><td data-label={labels.name}>{material.title}</td><td data-label={labels.kind}>{labels[material.kind]}</td><td data-label={labels.assignments}>{material.assignments.length}</td><td data-label={labels.updated}>{formatCourseDate(material.updatedAt,"")}</td><td data-label={labels.edit}><div className="lms-admin-actions"><button type="button" className="lms-text-link" onClick={onEdit}>{labels.edit}</button><button type="button" className="lms-text-link" onClick={()=>setRemoving(true)}>{labels.remove}</button></div>
  {removing&&<AdminDialog title={labels.confirmRemove} closeLabel={labels.cancel} pending={command.pending} onClose={()=>setRemoving(false)}><form onSubmit={event=>{event.preventDefault();void command.save({operation:"delete",id:material.id,revision:material.revision}).then(saved=>{if(saved) setRemoving(false);});}}><p>{material.title}</p><SaveFeedback {...command} labels={{save:labels.remove,saving:labels.saving,saved:labels.saved}}/></form></AdminDialog>}
 </td></tr>;
}
