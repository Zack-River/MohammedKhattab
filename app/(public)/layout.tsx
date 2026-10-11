import { designerCredit } from "@/config/designer";
import { projectNavigation } from "@/config/project-navigation";
import { interfaceCopy } from "@platform/data/interface-copy";
import { marketingNavigation } from "@platform/data/site";
import { copy } from "@platform/data/site";
import { site } from "@platform/data/site";
import SiteHeader from "@platform/components/layout/site-header";
import SiteFooter from "@platform/components/layout/site-footer";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader
        interfaceCopy={{
          mainNavigationLabel: interfaceCopy.mainNavigationLabel,
          dashboardLabel: interfaceCopy.dashboardLabel,
        }}
        marketingNavigation={marketingNavigation}
        copy={{ start: copy.start, close: copy.close, menu: copy.menu }}
        site={{ name: site.name, englishName: site.englishName }}
      />
      {children}
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
