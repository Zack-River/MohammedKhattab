import {apiResponse} from "@platform/lib/api/respond";
import {ApiError} from "@platform/lib/api/error";
import {readJson,sameOrigin} from "@platform/lib/server-request";
import {requireAdmin} from "../identity";
import {validUserId} from "../helpers/read-moderation";
import {validateEnrollment} from "./validate";
import {manageEnrollment} from "./repository";
export function handleEnrollmentChange(request:Request,userId:string) {
 return apiResponse(async()=>{
  await requireAdmin();
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const input=validateEnrollment(await readJson(request));
  if(!validUserId(userId)||!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await manageEnrollment(userId,input));
 });
}
