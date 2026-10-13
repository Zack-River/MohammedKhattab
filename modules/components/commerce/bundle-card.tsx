import Link from "next/link";
import { routes } from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
import PriceSummary from "./price-summary";
import type { BundleProduct,CommerceLabels } from "@platform/types/commerce";
export default function BundleCard({bundle,labels,courses,detail=false}:{bundle:BundleProduct;labels:CommerceLabels;courses:readonly {slug:string;title:string;delivery?:'live' | 'recorded'}[];detail?:boolean}) {
 return <article className="lms-profile-card lms-bundle-card" data-reveal="true"><h2>{detail ? bundle.title : <Link className="lms-course-text-link" href={bundle.featured ? routes.featured(bundle.slug, "bundle") : routes.bundle(bundle.slug)}>{bundle.title}</Link>}</h2><p>{bundle.description}</p>
 <div><h3>{labels.includes}</h3><ul>{bundle.courseSlugs.map(slug=>{const course=courses.find(course=>course.slug===slug);return <li key={slug}><Link className="lms-course-text-link" href={routes.course(slug,course?.delivery)}>{course?.title ?? slug}<Symbol name="arrow" /></Link></li>;})}</ul></div>
 <PriceSummary quote={bundle.quote} labels={labels} /><Link href={routes.bundleCheckout(bundle.slug)} className="btn-primary lms-full-button">{labels.buyBundle}<Symbol name="arrow" /></Link></article>;
}
