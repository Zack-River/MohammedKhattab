import RevealContent from "@platform/components/marketing/reveal-content";
import { designerCredit } from "@/config/designer";
import { projectNavigation } from "@/config/project-navigation";
import { interfaceCopy } from "@platform/data/interface-copy";
import { marketingNavigation,copy,site } from "@platform/data/site";
import MainSiteHeader from "./main-site-header";
import SiteFooter from "@platform/components/layout/site-footer";
export default async function PublicSiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MainSiteHeader />
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
