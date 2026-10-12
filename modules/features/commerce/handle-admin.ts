import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { readJson,sameOrigin } from "@platform/lib/server-request";
import { requireAdmin } from "@platform/features/admin/identity";
import { commerceKinds,commercePolicy } from "@platform/config/commerce";
import { validateCommerceRecord } from "./helpers/validate-record";
import { readCommerceList } from "./repositories/admin-records";
import { saveCommerceRecord,deleteCommerceRecord } from "./repositories/save-record";
import type { CommerceKind } from "@platform/types/commerce";
export function handleCommerceAdmin(request:Request,kind:string) {
 return apiResponse(async()=>{
  await requireAdmin();if(!commerceKinds.includes(kind as CommerceKind)) throw new ApiError(404,"NOT_FOUND");
  const category=kind as CommerceKind;
  if(request.method==='GET') {
   const params=new URL(request.url).searchParams;
   return Response.json(await readCommerceList(category,(params.get('q') ?? '').slice(0,commercePolicy.maxSearch),params.get('status') ?? 'all',Math.min(10000,Math.max(1,Math.floor(Number(params.get('page')) || 1)))));
  }
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const body=await readJson(request);
  if(request.method==='DELETE') {
   if(typeof body?.key!=='string' || body.key.length>100 || typeof body.revision!=="number" || !Number.isInteger(body.revision) || body.revision<1) throw new ApiError(400,"INVALID_INPUT");
   return Response.json(await deleteCommerceRecord(category,body.key,body.revision));
  }
  const input=validateCommerceRecord(category,body);if(!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await saveCommerceRecord(category,input));
 });
}
