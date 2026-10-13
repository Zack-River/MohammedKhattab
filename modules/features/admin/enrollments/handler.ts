import {apiResponse} from "@platform/lib/api/respond";
import {ApiError} from "@platform/lib/api/error";
import {readJson,sameOrigin} from "@platform/lib/server-request";
import {requireAdmin} from "../identity";
import {validUuid} from "@platform/helpers/validation/uuid";
import {validateEnrollment} from "./validate";
import {manageEnrollment} from "./repository";
import {validateAccessGrant} from "./validate-grant";
import {grantAccess} from "./grant";
export function handleEnrollmentChange(request:Request,userId:string) {
 return apiResponse(async()=>{
  await requireAdmin();
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const body=await readJson(request),grant=validateAccessGrant(body);
  if(!validUuid(userId)) throw new ApiError(400,"INVALID_INPUT");
  if(grant) return Response.json(await grantAccess(userId,grant));
  if(body&&typeof body==="object"&&"kind" in body) throw new ApiError(400,"INVALID_INPUT");
  const input=validateEnrollment(body);
  if(!validUuid(userId)||!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await manageEnrollment(userId,input));
 });
}
