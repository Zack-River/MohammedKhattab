import { templateLockedFields,templatePolicy } from "@platform/config/workshop-template";
import { useTemplateLabels } from "@platform/hooks/use-template-labels";
import { moveTemplateItem } from "@platform/features/marketing/templates/helpers/move-items";
import type { TemplateValue } from "@platform/types/workshop-template";
import TemplatePrimitiveField from "./primitive-field";
import TemplateItemActions from "./item-actions";
type Props={value:TemplateValue;sample:TemplateValue;name:string;onChange:(value:TemplateValue)=>void};
export default function TemplateValueFields({value,sample,name,onChange}:Props) {
 const {copy:templateCopy,fields:templateFieldLabels}=useTemplateLabels();
 const label=templateFieldLabels[name] ?? name;
 if(templateLockedFields.has(name)) return null;
 if(value===null || typeof value!=='object') return <TemplatePrimitiveField {...{label,value,onChange}} nullable={sample===null} />;
 if(Array.isArray(value)) {
  const prototypes=Array.isArray(sample) ? sample : [],rich=['title','description','manifesto','children'].includes(name);
  const add=(item:TemplateValue)=>onChange([...value,structuredClone(item)]);
  return <div className="lms-template-list"><h3>{label}</h3>{value.map((item,index)=><details className="lms-template-item" key={index}><summary>{label} {index+1}</summary><TemplateItemActions index={index} count={value.length} onMove={to=>onChange(moveTemplateItem(value,index,to))} onRemove={()=>onChange(value.filter((_,i)=>i!==index))} /><TemplateValueFields value={item} sample={prototypes.find(p=>typeof p===typeof item) ?? item} name={typeof item==='object' ? '' : templateCopy.item} onChange={next=>onChange(value.map((v,i)=>i===index ? next : v))} /></details>)}
   {value.length<templatePolicy.maxItems && <div className="lms-template-item-actions">{rich ? <><button type="button" className="lms-text-link" onClick={()=>add('')}>{templateCopy.text}</button><button type="button" className="lms-text-link" onClick={()=>add({kind:'span',className:'highlight-red',children:['']})}>{templateCopy.highlight}</button></> : <button type="button" className="lms-text-link" disabled={!prototypes.length && !value.length} onClick={()=>add(prototypes[0] ?? value[0])}>{templateCopy.add}</button>}</div>}
  </div>;
 }
 const baseline=sample && typeof sample==='object' && !Array.isArray(sample) ? sample : {};
 return <div className="lms-template-fields">{Object.entries(value).filter(([key])=>!templateLockedFields.has(key)).map(([key,item])=>{
  const fields=<TemplateValueFields value={item} sample={baseline[key] ?? item} name={key} onChange={next=>onChange({...value,[key]:next})} />;
  return item && typeof item==='object' && !Array.isArray(item) ? <details className="lms-template-item" key={key}><summary>{templateFieldLabels[key] ?? key}</summary>{fields}</details> : <div key={key}>{fields}</div>;
 })}</div>;
}
