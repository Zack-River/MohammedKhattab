import BundlesCatalog from "@platform/features/commerce/bundles-catalog";
import { commerceCopy } from "@platform/data/commerce";
export const metadata={title:commerceCopy.bundles};
export default function Page() { return <main className="container lms-public-main"><BundlesCatalog /></main>; }
