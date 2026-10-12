export function moveTemplateItem<T>(items:readonly T[],from:number,to:number):T[] {
 const next=[...items]; if(to<0 || to>=next.length) return next;
 const [item]=next.splice(from,1);next.splice(to,0,item);return next;
}
