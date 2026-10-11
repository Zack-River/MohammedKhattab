import RevealContent from "@platform/components/marketing/reveal-content";
import { readNavigationAccount } from "@platform/features/auth/server/navigation-account";
import { designerCredit } from "@/config/designer";
import { projectNavigation } from "@/config/project-navigation";
import { interfaceCopy } from "@platform/data/interface-copy";
import { marketingNavigation } from "@platform/data/site";
import { copy } from "@platform/data/site";
import { site } from "@platform/data/site";
import SiteHeader from "@platform/components/layout/site-header";
import SiteFooter from "@platform/components/layout/site-footer";
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader
        account={await readNavigationAccount()}
        interfaceCopy={{
          mainNavigationLabel: interfaceCopy.mainNavigationLabel,
        }}
        marketingNavigation={marketingNavigation}
        copy={{ start: copy.start, close: copy.close, menu: copy.menu }}
        site={{ name: site.name, englishName: site.englishName }}
      />
      <RevealContent as="div">{children}</RevealContent>
      <SiteFooter
        credit={designerCredit}
        projectNavigation={projectNavigation}
        interfaceCopy={{ contactLabel: interfaceCopy.contactLabel }}
        copy={{ footer: copy.footer, copyright: copy.copyright }}
        site={{
          email: site.email,
          demoLabel: site.demoLabel,
          name: site.name,
          englishName: site.englishName,
        }}
        marketingNavigation={marketingNavigation}
      />
    </>
  );
}
