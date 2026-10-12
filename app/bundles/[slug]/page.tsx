import { notFound } from "next/navigation";
import { findBundle } from "@platform/features/commerce/repositories/bundles";
import { listCourses } from "@platform/features/catalog/service";
import BundleCard from "@platform/components/commerce/bundle-card";
import { commerceCopy } from "@platform/data/commerce";
import FeaturedCourse from "@platform/features/marketing/templates/featured-course";
import PublicSiteShell from "@platform/features/marketing/public-site-shell";
import { bundleTemplateCourse } from "@platform/features/marketing/templates/helpers/bundle-course";
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const bundle=await findBundle((await params).slug);if(!bundle) notFound();
 const courses=await listCourses();
 if(bundle.featured) return <FeaturedCourse kind="bundle" quote={bundle.quote} course={bundleTemplateCourse({...bundle,amountMinor:bundle.quote.baseMinor},bundle.courseSlugs.map(slug=>courses.find(course=>course.slug===slug)!).filter(Boolean))} />;
 return <PublicSiteShell> <main className="container lms-public-main lms-bundle-details"><h1>{commerceCopy.bundles}</h1><BundleCard bundle={bundle} labels={commerceCopy} courses={courses.map(({slug,title,delivery})=>({slug,title,delivery}))} detail /></main></PublicSiteShell>;
}
