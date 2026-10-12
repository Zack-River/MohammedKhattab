import { findCourse } from "@platform/features/catalog/service";
import { isFeaturedCourse } from "@platform/features/catalog/helpers/is-featured-course";
import { readWorkshopTemplate } from "@platform/features/marketing/templates/repository";
import { templateMediaUrl } from "@platform/features/marketing/templates/helpers/template-media";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { streamDrive } from "@platform/features/catalog/stream-drive";
import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}) {
 return apiResponse(async()=>{
  const course=await findCourse((await params).slug);
  if(!course || !isFeaturedCourse(course)) throw new ApiError(404,'NOT_FOUND');
  const {document}=await readWorkshopTemplate(course),clip=new URL(request.url).searchParams.get('clip') ?? '';
  const url=templateMediaUrl(document,clip);
  if(!url || !driveFileId(url) || !document.order.includes(clip==='hero' ? 'hero' : 'clients')) throw new ApiError(404,'NOT_FOUND');
  return streamDrive(url,request);
 });
}
