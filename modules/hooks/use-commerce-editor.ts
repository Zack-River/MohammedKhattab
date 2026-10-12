"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAsyncCommand } from "./use-async-command";
import { endpoints } from "@platform/config/navigation";
import { readCommerceForm } from "@platform/features/commerce/helpers/read-form";
import type { CommerceKind,CommerceRecord } from "@platform/types/commerce";
export function useCommerceEditor(kind:CommerceKind,error:string) {
 const router=useRouter(),command=useAsyncCommand(error);
 const [selected,setSelected]=useState<CommerceRecord | null>(null),[deleting,setDeleting]=useState(false);
 async function submit(form?:FormData) {
  if(!selected) return;
  const result=await command.run(async()=>{
   const response=await fetch(endpoints.adminCommerce(kind),{method:deleting ? 'DELETE' : 'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(deleting ? {key:selected.key,revision:selected.revision} : readCommerceForm(form!,selected)),signal:AbortSignal.timeout(30000)});
   const result=await response.json();if(!response.ok) throw new Error(result.error);return true;
  });
  if(result) {setSelected(null);router.refresh();}
 }
 return {...command,selected,deleting,submit,open:(record:CommerceRecord,remove=false)=>{setDeleting(remove);setSelected(record);},close:()=>setSelected(null)};
}
