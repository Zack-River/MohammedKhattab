import "server-only";
import {requireAdmin} from "../identity";
import {enrollmentError} from "./errors";
import type {AccessGrant} from "@platform/types/access-grant";
export async function grantAccess(userId:string,grant:AccessGrant) {
 const {client}=await requireAdmin();
 // Supabase's generated timestamp argument excludes SQL NULL; preserve NULL for lifetime grants.
 const result=await client.rpc("grant_enrollment_access",{p_user:userId,p_kind:grant.kind,p_slug:grant.slug,p_until:grant.expiresAt!,p_reason:grant.reason,p_revisions:grant.revisions});
 if(result.error) enrollmentError(result.error.message);
 return {saved:true,changed:result.data};
}
