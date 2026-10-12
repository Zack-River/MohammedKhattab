import { useTemplateLabels } from "@platform/hooks/use-template-labels";
export default function TemplateItemActions({index,count,onMove,onRemove}:{index:number;count:number;onMove:(to:number)=>void;onRemove:()=>void}) {
 const {copy:templateCopy}=useTemplateLabels();
 return <div className="lms-template-item-actions"><button type="button" className="lms-text-link" disabled={index===0} onClick={()=>onMove(index-1)} aria-label={`${templateCopy.up} ${index+1}`}>↑</button><button type="button" className="lms-text-link" disabled={index===count-1} onClick={()=>onMove(index+1)} aria-label={`${templateCopy.down} ${index+1}`}>↓</button><button type="button" className="lms-text-link" onClick={onRemove}>{templateCopy.remove}</button></div>;
}
