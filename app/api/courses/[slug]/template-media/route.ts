import { handleTemplateMedia } from "@platform/features/marketing/templates/handle-media";
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}) {
 return handleTemplateMedia("course",(await params).slug,request);
}
