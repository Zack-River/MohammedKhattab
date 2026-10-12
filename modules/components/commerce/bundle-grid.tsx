import BundleCard from "./bundle-card";
import type { BundleProduct,CommerceLabels } from "@platform/types/commerce";
export default function BundleGrid({bundles,labels,courses}:{bundles:BundleProduct[];labels:CommerceLabels;courses:readonly {slug:string;title:string;delivery?:'live' | 'recorded'}[]}) {
 if(!bundles.length) return null;
 return <section className="lms-bundles-section"><h2>{labels.bundlesHeading}</h2><div className="lms-commerce-bundle-grid">{bundles.map(bundle=><BundleCard key={bundle.slug} {...{bundle,labels,courses}} />)}</div></section>;
}
