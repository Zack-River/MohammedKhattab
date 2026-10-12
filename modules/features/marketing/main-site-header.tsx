import SiteHeader from "@platform/components/layout/site-header";
import { readNavigationAccount } from "@platform/features/auth/server/navigation-account";
import { interfaceCopy } from "@platform/data/interface-copy";
import { marketingNavigation,copy,site } from "@platform/data/site";
export default async function MainSiteHeader() {
 return <SiteHeader account={await readNavigationAccount()} interfaceCopy={{mainNavigationLabel:interfaceCopy.mainNavigationLabel}} marketingNavigation={marketingNavigation} copy={{start:copy.start,close:copy.close,menu:copy.menu}} site={{name:site.name,englishName:site.englishName}} />;
}
