import { notFound } from "next/navigation";
import { findBundle } from "@platform/features/commerce/repositories/bundles";
import { listCourses } from "@platform/features/catalog/service";
import BundleCard from "@platform/components/commerce/bundle-card";
import { commerceCopy } from "@platform/data/commerce";
import PublicSiteShell from "@platform/features/marketing/public-site-shell";
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 const bundle=await findBundle((await params).slug);if(!bundle) notFound();
 const courses=await listCourses();
 return <PublicSiteShell> <main className="container lms-public-main lms-bundle-details"><h1>{commerceCopy.bundles}</h1><BundleCard bundle={bundle} labels={commerceCopy} courses={courses.map(({slug,title,delivery})=>({slug,title,delivery}))} detail /></main></PublicSiteShell>;
}
