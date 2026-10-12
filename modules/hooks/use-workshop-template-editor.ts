"use client";
import { useState } from "react";
import { endpoints } from "@platform/config/navigation";
import { useAdminSave } from "./use-admin-save";
import type { TemplateRecord } from "@platform/types/workshop-template";
export function useWorkshopTemplateEditor(slug:string,record:TemplateRecord,errorLabel:string,endpoint=endpoints.adminTemplate(slug)) {
 const [document,setDocument]=useState(record.document),[revision,setRevision]=useState(record.revision);
 const command=useAdminSave(endpoint,errorLabel,{refresh:false});
 async function save(){if(await command.save({document,revision})) setRevision(v=>v+1);}
 return {...command,document,setDocument,save};
}
