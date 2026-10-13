import { readLiveQuery } from "./helpers/read-query";
import { requireAdmin } from "@platform/features/admin/identity";
import { readAdminLiveSessions,mutateLiveSession } from "./repositories/admin";
import { validateLiveSession,validSessionId } from "./helpers/validate-input";
import { apiResponse } from "@platform/lib/api/respond";
import { sameOrigin,readJson } from "@platform/lib/server-request";
import { ApiError } from "@platform/lib/api/error";
export function handleAdminLiveSessions(request:Request) {
 return apiResponse(async()=>{
  await requireAdmin();
  if(request.method==="GET") return Response.json(await readAdminLiveSessions(readLiveQuery(Object.fromEntries(new URL(request.url).searchParams))),{headers:{"Cache-Control":"private, no-store"}});
  if(!sameOrigin(request)) throw new ApiError(403,"FORBIDDEN");
  const body=await readJson(request);
  if(body?.operation==="delete") {
   if(!validSessionId(body.id)||!Number.isSafeInteger(body.revision)||Number(body.revision)<1) throw new ApiError(400,"INVALID_INPUT");
   return Response.json(await mutateLiveSession({id:body.id,revision:Number(body.revision)},true));
  }
  const input=validateLiveSession(body);if(!input) throw new ApiError(400,"INVALID_INPUT");
  return Response.json(await mutateLiveSession(input));
 });
}
