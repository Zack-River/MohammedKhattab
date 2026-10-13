import "server-only";
import {requireAdmin} from "../identity";
import {ApiError} from "@platform/lib/api/error";
import type {CourseChoice} from "@platform/types/materials";
/** Enrollment selection does not need curriculum JSON or private media. */
export async function adminCourseTitles():Promise<Pick<CourseChoice,"slug"|"title">[]> {
 const {client}=await requireAdmin();
 const result=await client.from("courses").select("slug,title:metadata->>title").order("position");
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return result.data.map(row=>({slug:row.slug,title:String(row.title)}));
}
