import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
import type { Json } from "@platform/types/database";
import type { CommerceKind,CommerceInput } from "@platform/types/commerce";
export async function saveCommerceRecord(kind:CommerceKind,input:CommerceInput) {
 const client=createAuthAdministrator(),p_input=input as unknown as Json;
 const result=kind==='bundles' ? await client.rpc('save_commerce_bundle',{p_input}) : await client.rpc('save_commerce_discount',{p_kind:kind,p_input});
 if(result.error) commerceDatabaseError(result.error);
 return {saved:true};
}
export async function deleteCommerceRecord(kind:CommerceKind,key:string,revision:number) {
 const result=await createAuthAdministrator().rpc('delete_commerce_record',{p_kind:kind,p_key:key,p_revision:revision});
 if(result.error) commerceDatabaseError(result.error);
 return {deleted:true};
}
