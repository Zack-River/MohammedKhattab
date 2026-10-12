import { publicBundles } from "./repositories/bundles";
import { listCourses } from "@platform/features/catalog/service";
import { commerceCopy } from "@platform/data/commerce";
import BundleGrid from "@platform/components/commerce/bundle-grid";
export default async function BundlesCatalog() {
 const [bundles,courses]=await Promise.all([publicBundles(),listCourses()]);
 return <BundleGrid bundles={bundles} courses={courses.map(({slug,title,delivery})=>({slug,title,delivery}))} labels={commerceCopy} />;
}
