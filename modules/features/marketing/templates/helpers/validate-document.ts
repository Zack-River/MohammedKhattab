import { workshopSectionKeys,templatePolicy } from "@platform/config/workshop-template";
import { validTemplateValue } from "./validate-value";
import type { WorkshopTemplate } from "@platform/types/workshop-template";
export function validateWorkshopTemplate(value:unknown,sample:WorkshopTemplate):value is WorkshopTemplate {
 if(!value || typeof value!=='object' || Array.isArray(value)) return false;
 const v=value as WorkshopTemplate;
 if(Object.keys(v).some(k=>!['content','order','showCountdown','showSignup'].includes(k)) || typeof v.showCountdown!=='boolean' || typeof v.showSignup!=='boolean') return false;
 if(!Array.isArray(v.order) || !v.order.includes('hero') || v.order.length>workshopSectionKeys.length || new Set(v.order).size!==v.order.length || v.order.some(key=>!workshopSectionKeys.includes(key))) return false;
 if(new TextEncoder().encode(JSON.stringify(v)).length>templatePolicy.maxBytes) return false;
 return validTemplateValue(v.content,sample.content);
}
