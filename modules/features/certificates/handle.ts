import {requireIdentity} from "@platform/features/auth/server/identity";
import {requireAdmin} from "@platform/features/admin/identity";
import {apiResponse} from "@platform/lib/api/respond";
import {ApiError} from "@platform/lib/api/error";
import {readJson,sameOrigin} from "@platform/lib/server-request";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {certificatePolicy} from "@platform/config/certificates";
import {listCertificates} from "./repository";
import {validateCertificate} from "./validate";
import {mutateCertificate} from "./mutate";
export function handleCertificates(request:Request,admin=false) {
 return apiResponse(async()=>{
  await (admin?requireAdmin():requireIdentity());
  if(request.method==="GET") return Response.json(await listCertificates(readRecordQuery(Object.fromEntries(new URL(request.url).searchParams),certificatePolicy.statuses),admin));
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const input=validateCertificate(await readJson(request),admin);if(!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await mutateCertificate(input,admin));
 });
}
