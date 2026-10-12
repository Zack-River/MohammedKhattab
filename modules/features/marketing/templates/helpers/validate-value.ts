import { templatePolicy,templateLockedFields } from "@platform/config/workshop-template";
import { validMediaUrl } from "@platform/features/admin/helpers/validate-media-url";
import { templateArrayPrototypes } from "./array-prototypes";
import { validTemplateRichText } from "./validate-rich-text";
export function validTemplateValue(value:unknown,sample:unknown,key='',depth=0):boolean {
 if(depth>templatePolicy.maxDepth) return false;
 if(templateLockedFields.has(key)) return JSON.stringify(value)===JSON.stringify(sample);
 if(sample===null) return value===null || key==='endsAt' && typeof value==='string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
 if(typeof sample==='string') {
  if(typeof value!=='string' || value.length>templatePolicy.maxString) return false;
  if(['src','url','poster'].includes(key)) return Boolean(value) && validMediaUrl(value);
  if(key==='href') return /^(?:\/(?!\/)|#[a-zA-Z][\w-]*$)/.test(value) || Boolean(value) && validMediaUrl(value);
  return true;
 }
 if(typeof sample==='boolean') return typeof value==='boolean';
 if(typeof sample==='number') {
  if(typeof value!=='number' || !Number.isFinite(value) || value<0 || value>1_000_000) return false;
  if(['width','height','tickMs','visibleMs','intervalMs'].includes(key) && value<1) return false;
  if(['tickMs','intervalMs'].includes(key) && value<200) return false;
  return true;
 }
 if(Array.isArray(sample)) {
  if(!Array.isArray(value) || value.length>templatePolicy.maxItems) return false;
  if(['title','description','manifesto','children'].includes(key)) return validTemplateRichText(value);
  const prototypes=sample.length ? sample : templateArrayPrototypes(key);
  return value.every(item=>prototypes.some(prototype=>validTemplateValue(item,prototype,'',depth+1)));
 }
 if(sample && typeof sample==='object') {
  if(!value || typeof value!=='object' || Array.isArray(value)) return false;
  const s=sample as Record<string,unknown>,v=value as Record<string,unknown>;
  return Object.keys(v).every(k=>Object.hasOwn(s,k)) && Object.keys(s).every(k=>Object.hasOwn(v,k) && validTemplateValue(v[k],s[k],k,depth+1));
 }
 return false;
}
