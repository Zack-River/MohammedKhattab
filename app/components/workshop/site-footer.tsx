import DesignerCredit from "@khatab/design/ui/designer-credit";
import ProjectNavigation from "@khatab/design/ui/project-navigation";
import SocialLinks from "@khatab/design/ui/social-links";
import Container from "@khatab/design/ui/container";
import type { FooterContent } from "@khatab/design/types/marketing";

export default function SiteFooter({ content }: { content: FooterContent }) {
  return (
    <footer className="site-footer">
      <Container className="footer-layout">
        <div className="footer-brand">
          <a
            href={content.brand.href}
            className="footer-brand-title footer-scroll-top-link"
            title={content.brand.title}
          >
            {content.brand.label}
          </a>
          <div className="footer-copy-text">{content.copyright}</div>
          {content.projectNavigation && <ProjectNavigation content={content.projectNavigation} />}
        </div>
        <div className="footer-social-wrapper">
          <SocialLinks links={content.social} />
          <div className="footer-designer-credit"><DesignerCredit credit={content.credit} /></div>
        </div>
      </Container>
    </footer>
  );
}
