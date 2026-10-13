import {validRecordRevision} from "@platform/helpers/valid-record-revision";
import {requireAdmin} from "@platform/features/admin/identity";
import {apiResponse} from "@platform/lib/api/respond";
import {ApiError} from "@platform/lib/api/error";
import {readJson,sameOrigin} from "@platform/lib/server-request";
import {validateMaterial} from "./validate-material";
import {readRecordQuery} from "@platform/helpers/read-record-query";
import {materialPolicy} from "@platform/config/materials";
import {readAdminMaterials,mutateMaterial} from "./admin-repository";
export function handleAdminMaterial(request:Request) {
 return apiResponse(async()=>{
  await requireAdmin();
  if(request.method==="GET") return Response.json(await readAdminMaterials(readRecordQuery(Object.fromEntries(new URL(request.url).searchParams),materialPolicy.kinds)));
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const body=await readJson(request);
  if(body?.operation==="delete") {
   if(typeof body.id!=="string"||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.id)||!validRecordRevision(body.revision)) throw new ApiError(400,"INVALID_INPUT");
   return Response.json(await mutateMaterial({id:body.id,revision:Number(body.revision)},true));
  }
  const input=validateMaterial(body);if(!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await mutateMaterial(input));
 });
}
