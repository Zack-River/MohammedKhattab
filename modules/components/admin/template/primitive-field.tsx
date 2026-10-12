import FormField from "@platform/components/ui/form-field";
import TextareaField from "@platform/components/ui/textarea-field";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import type { TemplateValue } from "@platform/types/workshop-template";
export default function TemplatePrimitiveField({label,value,onChange,nullable}:{label:string;value:string | number | boolean | null;onChange:(value:TemplateValue)=>void;nullable?:boolean}) {
 if(typeof value==='boolean') return <Checkbox label={label} checked={value} onChange={e=>onChange(e.currentTarget.checked)} />;
 if(typeof value==='number') return <FormField label={label} type="number" min={0} max={1000000} value={value} onChange={e=>onChange(e.currentTarget.valueAsNumber || 0)} />;
 return <TextareaField label={label} rows={value && value.length>120 ? 3 : 1} maxLength={6000} value={value ?? ''} onChange={e=>onChange(nullable && !e.target.value ? null : e.target.value)} />;
}
