import "server-only";
import { requireAdmin } from "@platform/features/admin/identity";
import { ApiError } from "@platform/lib/api/error";
import type { CourseModule } from "@platform/types/lms";
export async function liveSessionCourses() {
 const {client}=await requireAdmin();
 const result=await client.from("courses").select("slug,title:metadata->>title,modules:metadata->modules").order("position");
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return result.data.map(row=>({slug:row.slug,title:String(row.title),chapters:(row.modules as unknown as CourseModule[]).filter(chapter=>chapter.id).map(chapter=>({id:chapter.id!,title:chapter.title,sections:(chapter.sections ?? []).map(({id,title})=>({id,title}))}))}));
}
