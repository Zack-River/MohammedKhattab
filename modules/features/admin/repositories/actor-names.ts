import "server-only";
import {requireAdmin} from "../identity";
import {createAuthAdministrator} from "@platform/lib/supabase/admin";
import {ApiError} from "@platform/lib/api/error";
/** Resolve only display names for bounded, already-authorized event records. */
export async function readActorNames(actorIds:(string|null)[]) {
 await requireAdmin();const ids=[...new Set(actorIds.filter((id):id is string=>Boolean(id)))];
 if(!ids.length) return new Map<string,string>();
 const result=await createAuthAdministrator().from("profiles").select("id,name").in("id",ids);
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");return new Map(result.data.map(row=>[row.id,row.name]));
}
