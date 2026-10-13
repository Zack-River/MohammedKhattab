import {readResource} from "@platform/features/resources/service";
import {validMaterialLink} from "@platform/features/resources/validate-material";
import {ApiError} from "@platform/lib/api/error";
import {apiResponse} from "@platform/lib/api/respond";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
 return apiResponse(async()=>{
  const resource=await readResource((await params).id);
  if(resource.kind==="link") {
   if(!validMaterialLink(resource.content)) throw new ApiError(400,"INVALID_INPUT");
   return new Response(null,{status:302,headers:{Location:resource.content,"Referrer-Policy":"no-referrer"}});
  }
  return new Response(resource.content,{headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":`attachment; filename="${encodeURIComponent(resource.id)}.txt"`}});
 });
}
