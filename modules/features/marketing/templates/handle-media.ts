import { readPublicTemplateSubject } from "./public-subject";
import { isFeaturedCourse } from "@platform/features/catalog/helpers/is-featured-course";
import { readWorkshopTemplate } from "./repository";
import { templateMediaUrl } from "./helpers/template-media";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { streamDrive } from "@platform/features/catalog/stream-drive";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import type { ProductKind } from "@platform/types/commerce";
export function handleTemplateMedia(kind:ProductKind,slug:string,request:Request) {
 return apiResponse(async()=>{
  const course=await readPublicTemplateSubject(kind,slug);
  if(!course || !isFeaturedCourse(course)) throw new ApiError(404,'NOT_FOUND');
  const {document}=await readWorkshopTemplate(course,kind),clip=new URL(request.url).searchParams.get('clip') ?? '';
  const url=templateMediaUrl(document,clip);
  if(!url || !driveFileId(url) || !document.order.includes(clip==='hero' ? 'hero' : 'clients')) throw new ApiError(404,'NOT_FOUND');
  return streamDrive(url,request);
 });
}
