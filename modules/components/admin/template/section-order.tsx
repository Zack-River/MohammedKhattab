import { Checkbox } from "@khatab/design/ui/choice-controls";
import { workshopSectionKeys } from "@platform/config/workshop-template";
import { useTemplateLabels } from "@platform/hooks/use-template-labels";
import { moveTemplateItem } from "@platform/features/marketing/templates/helpers/move-items";
import type { WorkshopSectionKey } from "@platform/types/workshop-template";
export default function TemplateSectionOrder({order,onChange}:{order:WorkshopSectionKey[];onChange:(order:WorkshopSectionKey[])=>void}) {
 const {copy:templateCopy,fields:templateFieldLabels}=useTemplateLabels();
 return <section className="lms-profile-card"><h2>{templateCopy.visibility}</h2>{[...order,...workshopSectionKeys.filter(k=>!order.includes(k))].map((key,index)=><div className="lms-template-order-row" key={key}><Checkbox label={templateFieldLabels[key]} checked={order.includes(key)} disabled={key==='hero'} onChange={e=>onChange(e.currentTarget.checked ? [...order,key] : order.filter(k=>k!==key))} />{order.includes(key) && <div className="lms-template-item-actions"><button type="button" className="lms-text-link" disabled={index===0} aria-label={`${templateCopy.up} ${templateFieldLabels[key]}`} onClick={()=>onChange(moveTemplateItem(order,index,index-1))}>↑</button><button type="button" className="lms-text-link" disabled={index===order.length-1} aria-label={`${templateCopy.down} ${templateFieldLabels[key]}`} onClick={()=>onChange(moveTemplateItem(order,index,index+1))}>↓</button></div>}</div>)}</section>;
}
