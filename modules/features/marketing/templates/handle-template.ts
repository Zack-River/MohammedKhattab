import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { sameOrigin } from "@platform/lib/server-request";
import { readRequestBytes } from "@platform/lib/read-request-bytes";
import { requireAdmin } from "@platform/features/admin/identity";
import { readAdminCourses } from "@platform/features/admin/repositories/courses";
import { templatePolicy } from "@platform/config/workshop-template";
import { defaultWorkshopTemplate } from "./default-template";
import { validateWorkshopTemplate } from "./helpers/validate-document";
import { readWorkshopTemplate,saveWorkshopTemplate } from "./repository";
export function handleWorkshopTemplate(slug:string,request?:Request) {
 return apiResponse(async()=>{
  await requireAdmin();const record=(await readAdminCourses(slug))[0];
  if(!record || record.course.delivery!=='live') throw new ApiError(404,'NOT_FOUND');
  if(!request) return Response.json(await readWorkshopTemplate(record.course));
  if(!sameOrigin(request)) throw new ApiError(403,'FORBIDDEN');
  if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) throw new ApiError(400,'INVALID_INPUT');
  const bytes=await readRequestBytes(request,templatePolicy.maxRequestBytes);let body;
  try {body=JSON.parse(new TextDecoder().decode(bytes ?? new Uint8Array()));}catch{throw new ApiError(400,'INVALID_INPUT');}
  if(!body || !Number.isInteger(body.revision) || body.revision<0 || body.revision>2_000_000_000 || !validateWorkshopTemplate(body.document,defaultWorkshopTemplate(record.course))) throw new ApiError(400,'INVALID_INPUT');
  return Response.json(await saveWorkshopTemplate(slug,body.document,body.revision));
 });
}
