import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { requireAdmin } from "@platform/features/admin/identity";
import { readAdminCourses } from "@platform/features/admin/repositories/courses";
import { ApiError } from "@platform/lib/api/error";
import type { ProductKind } from "@platform/types/commerce";
import { bundleTemplateCourse } from "./helpers/bundle-course";
export async function readTemplateSubject(kind:ProductKind,slug:string) {
 if(kind==='course') return (await readAdminCourses(slug))[0]?.course;
 await requireAdmin();
 const client=createAuthAdministrator();
 const {data:bundle,error}=await client.from('commerce_bundles').select('*').eq('slug',slug).maybeSingle();
 if(error) throw new ApiError(503,'INTERNAL_ERROR');if(!bundle) return;
 const members=await client.from('commerce_bundle_courses').select('course_slug').eq('bundle_slug',slug).order('position');
 if(members.error) throw new ApiError(503,'INTERNAL_ERROR');
 const records=await readAdminCourses(),courses=members.data.map(member=>records.find(record=>record.course.slug===member.course_slug)?.course).filter(course=>!!course);
 return bundleTemplateCourse({slug,title:bundle.title,description:bundle.description,featured:bundle.featured,amountMinor:bundle.amount_minor},courses);
}
