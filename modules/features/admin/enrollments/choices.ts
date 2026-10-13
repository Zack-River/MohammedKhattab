import "server-only";
import {requireAdmin} from "../identity";
import {createAuthAdministrator} from "@platform/lib/supabase/admin";
import {ApiError} from "@platform/lib/api/error";
import type {AccessChoice} from "@platform/types/access-grant";
export async function adminBundleChoices():Promise<AccessChoice[]> {
 await requireAdmin();const client=createAuthAdministrator();
 const result=await client.from("commerce_bundles").select("slug,title,commerce_bundle_courses(course_slug)").eq("enabled",true).order("title");
 if(result.error) throw new ApiError(503,"INTERNAL_ERROR");
 return result.data.map(row=>({slug:row.slug,title:row.title,courseSlugs:row.commerce_bundle_courses.map(course=>course.course_slug)}));
}
