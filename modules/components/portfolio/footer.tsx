import DesignerCredit from "@khatab/design/ui/designer-credit";
import ProjectNavigation from "@khatab/design/ui/project-navigation";
import type { ProjectNavigationContent } from "@khatab/design/types/project-navigation";
import SocialIcon from "@khatab/design/ui/social-icon";
import type { LinkData, SocialLinkData } from "@khatab/design/types/ui";
import type { PortfolioContent } from "@platform/types/portfolio";
export default function PortfolioFooter({
  content,
  socials,
  projectNavigation,
  credit,
  homeHref,
}: {
  content: PortfolioContent["footer"];
  homeHref: string;
  socials: readonly SocialLinkData[];
  projectNavigation?: ProjectNavigationContent;
  credit?: LinkData;
}) {
  return (
    <footer className="p-ref-site-footer personal-footer">
      <div className="p-ref-container personal-container" data-reveal>
        <div className="p-ref-footer-top">
          <div className="p-ref-footer-info">
            <a
              className="p-ref-footer-name-link"
              href={homeHref}
              aria-label={content.backLabel}
            >
              {content.name}
            </a>
            <div className="p-ref-footer-role">{content.role}</div>
            {projectNavigation && <ProjectNavigation content={projectNavigation} />}
          </div>
          <div
            className="p-ref-footer-socials"
            aria-label={content.socialLabel}
          >
            {socials.map((link) => (
              <a
                className="p-ref-social-icon-btn"
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        </div>
        <div className="p-ref-footer-bottom">
          <div>{content.copyright}</div>
          {credit && <div className="p-ref-footer-designer-credit"><DesignerCredit credit={credit} /></div>}
        </div>
      </div>
    </footer>
  );
}
