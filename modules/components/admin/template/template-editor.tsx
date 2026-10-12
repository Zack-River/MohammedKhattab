"use client";
import Link from "next/link";
import { routes } from "@platform/config/navigation";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import { templateContentKeys } from "@platform/config/workshop-template";
import { TemplateLabelsContext,type TemplateLabels } from "@platform/hooks/use-template-labels";
import { useWorkshopTemplateEditor } from "@platform/hooks/use-workshop-template-editor";
import type { TemplateRecord,WorkshopTemplate,TemplateValue } from "@platform/types/workshop-template";
import TemplateValueFields from "./value-fields";
import TemplateSectionOrder from "./section-order";
import SaveFeedback from "../save-feedback";
export default function WorkshopTemplateEditor({slug,record,defaults,sample,labels,endpoint}:{slug:string;record:TemplateRecord;defaults:WorkshopTemplate;sample:WorkshopTemplate;labels:TemplateLabels;endpoint?:string}) {
 const {copy:templateCopy,fields:templateFieldLabels}=labels;
 const command=useWorkshopTemplateEditor(slug,record,templateCopy.error,endpoint),{document,setDocument}=command;
 return <TemplateLabelsContext value={labels}><form className="lms-profile-form lms-template-editor" onSubmit={e=>{e.preventDefault();void command.save();}}><p className="lms-field-hint">{templateCopy.hint}</p><fieldset disabled={command.pending}>
 <TemplateSectionOrder order={document.order} onChange={order=>setDocument(v=>({...v,order}))} />
 <section className="lms-profile-card"><p className="lms-field-hint">{templateCopy.saleHint}</p><Link className="lms-text-link" href={routes.adminCommerce("offers")}>{templateCopy.manageOffers}</Link><Checkbox label={templateCopy.showCountdown} checked={document.showCountdown} onChange={e=>setDocument(v=>({...v,showCountdown:e.target.checked}))} /></section>
 {templateContentKeys.map(key=><details className="lms-profile-card" key={key}><summary>{templateFieldLabels[key]}</summary><TemplateValueFields name={key} value={document.content[key] as unknown as TemplateValue} sample={sample.content[key as keyof typeof sample.content] as unknown as TemplateValue} onChange={next=>setDocument(v=>({...v,content:{...v.content,[key]:next}}))} /></details>)}
 <button type="button" className="lms-text-link" onClick={()=>{if(window.confirm(templateCopy.confirmReset)) setDocument(structuredClone(defaults));}}>{templateCopy.reset}</button></fieldset><SaveFeedback {...command} labels={templateCopy} /></form></TemplateLabelsContext>;
}
