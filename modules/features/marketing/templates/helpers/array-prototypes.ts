import { workshopPage } from "@/app/data/workshop";
export function templateArrayPrototypes(key:string):unknown[] {
 function find(value:unknown):unknown[] | undefined {
  if(!value || typeof value!=='object') return;
  if(!Array.isArray(value) && key in value && Array.isArray((value as Record<string,unknown>)[key])) return (value as Record<string,unknown>)[key] as unknown[];
  for(const child of Object.values(value)) {const result=find(child);if(result) return result;}
 }
 return find(workshopPage) ?? [];
}
