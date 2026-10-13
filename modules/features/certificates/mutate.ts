import {requireIdentity} from "@platform/features/auth/server/identity";
import {requireAdmin} from "@platform/features/admin/identity";
import {certificateError} from "./errors";
import type {CertificateAction} from "@platform/types/certificates";
export async function mutateCertificate(input:CertificateAction,admin=false) {
 const {client}=await (admin?requireAdmin():requireIdentity());
 const result=input.operation==="issue" ? await client.rpc("issue_certificate",{p_slug:input.slug,...(input.username?{p_username:input.username}:{})}) : await client.rpc("moderate_certificate",{p_id:input.id,p_action:input.operation,p_revision:input.revision,p_reason:input.reason});
 if(result.error) throw certificateError(result.error.message);
 return {saved:true};
}
