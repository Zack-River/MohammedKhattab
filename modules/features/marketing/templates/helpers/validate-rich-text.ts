import { templatePolicy } from "@platform/config/workshop-template";
const classes = new Set(["highlight-red","highlight-editors","numeral","trans-from","trans-arrow","trans-to"]);
export function validTemplateRichText(value:unknown,depth=0):boolean {
 if(depth>templatePolicy.maxDepth || !Array.isArray(value) || value.length>templatePolicy.maxItems) return false;
 return value.every(part=>{
  if(typeof part==='string') return part.length<=templatePolicy.maxString;
  if(!part || typeof part!=='object' || Array.isArray(part)) return false;
  const p=part as Record<string,unknown>;
  if(p.kind==='break') return Object.keys(p).length===1;
  if(!['span','strong'].includes(String(p.kind)) || Object.keys(p).some(k=>!['kind','className','decorative','icon','children'].includes(k))) return false;
  if(p.className!==undefined && !classes.has(String(p.className)) || p.decorative!==undefined && typeof p.decorative!=='boolean') return false;
  if(p.icon!==undefined) {
   const i=p.icon as Record<string,unknown>;
   if(!i || typeof i!=='object' || Object.keys(i).some(k=>!['name','className','width','height'].includes(k)) || !['arrow','sparkle','shield','play','reel-play','menu','chevron'].includes(String(i.name))) return false;
   if(i.className!==undefined && i.className!=='badge-sparkle-icon' || ['width','height'].some(k=>i[k]!==undefined && (typeof i[k]!=='number' || !Number.isFinite(i[k]) || Number(i[k])<1 || Number(i[k])>100))) return false;
  }
  return validTemplateRichText(p.children,depth+1);
 });
}
