import DesignerCredit from "@khatab/design/ui/designer-credit";
import type { LinkData } from "@khatab/design/types/ui";
import ProjectNavigation from "@khatab/design/ui/project-navigation";
import type { ProjectNavigationContent } from "@khatab/design/types/project-navigation";
import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";

import Link from "next/link";
import Brand from "./brand";
export default function SiteFooter({
  interfaceCopy,
  copy,
  site,
  marketingNavigation,
  projectNavigation,
  credit,
  homeHref = routes.home,
  contactHref = `mailto:${site.email}`,
}: {
  projectNavigation?: ProjectNavigationContent;
  credit?: LinkData;
  homeHref?: string;
  contactHref?: string;
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "contactLabel">;
  copy: Pick<ContentBindings["copy"], "footer" | "copyright">;
  site: Pick<
    ContentBindings["site"],
    "email" | "demoLabel" | "name" | "englishName"
  >;
  marketingNavigation: ContentBindings["marketingNavigation"];
}) {
  return (
    <footer className="lms-footer">
      <div className="container lms-footer-grid">
        <div>
          <Brand
            href={homeHref}
            site={{ name: site.name, englishName: site.englishName }}
          />
          <p>{copy.footer}</p>
        </div>
        <div className="lms-footer-links">
          {marketingNavigation.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <a href={contactHref}>{interfaceCopy.contactLabel}</a>
          {projectNavigation && <ProjectNavigation content={projectNavigation} />}
        </div>
      </div>
      <div className="container lms-footer-bottom">
        <span>{copy.copyright}</span>
        <span>{site.demoLabel}</span>
        {credit && <DesignerCredit credit={credit} />}
      </div>
    </footer>
  );
}
