import "server-only";
import { findCourse,listCourses } from "@platform/features/catalog/service";
import { findBundle } from "@platform/features/commerce/repositories/bundles";
import type { ProductKind } from "@platform/types/commerce";
import { bundleTemplateCourse } from "./helpers/bundle-course";
export async function readPublicTemplateSubject(kind:ProductKind,slug:string) {
 if(kind==='course') return findCourse(slug);
 const bundle=await findBundle(slug);if(!bundle) return;
 const courses=await listCourses();
 return bundleTemplateCourse({...bundle,amountMinor:bundle.quote.baseMinor},bundle.courseSlugs.map(slug=>courses.find(course=>course.slug===slug)!).filter(Boolean));
}
