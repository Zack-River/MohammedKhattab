import {validUuid} from "@platform/helpers/validation/uuid";
import {certificatePolicy} from "@platform/config/certificates";
import {validRecordRevision} from "@platform/helpers/valid-record-revision";
import {isValidUsername,normalizeUsername} from "@platform/helpers/validation/username";
import type {CertificateAction} from "@platform/types/certificates";
export function validateCertificate(value:Record<string,unknown>|null,admin=false):CertificateAction|null {
 if(value?.operation==="issue" && typeof value.slug==="string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) && value.slug.length<=120) {
  if(!admin) return value.username===undefined?{operation:"issue",slug:value.slug}:null;
  return typeof value.username==="string" && isValidUsername(value.username)?{operation:"issue",slug:value.slug,username:normalizeUsername(value.username)}:null;
 }
 if(admin && (value?.operation==="revoke"||value?.operation==="restore") && validUuid(value.id) && validRecordRevision(value.revision) && typeof value.reason==="string" && value.reason.trim().length>0 && value.reason.length<=certificatePolicy.reasonMax)
  return {operation:value.operation,id:value.id,revision:Number(value.revision),reason:value.reason.trim()};
 return null;
}
