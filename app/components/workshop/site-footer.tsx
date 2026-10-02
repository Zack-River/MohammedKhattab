import Container from "@/app/components/ui/container";
import type { JSX } from "react";
import { contactLinks, siteConfig } from "@/app/config/site";
import SocialLinks from "./social-links";
import ScrollToTopLink from "./scroll-to-top-link";

export default function SiteFooter(): JSX.Element {
  return (
    <footer className="border-t border-line bg-footer py-12 sm:py-16">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <ScrollToTopLink />
          <div className="text-center text-sm text-muted md:text-start">
            جميع الحقوق محفوظة © ورشة التغيير — محمد خطاب
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-1.5 text-sm text-muted md:justify-start">
            <a href={contactLinks.phone}>{siteConfig.phoneDisplay}</a> ·{" "}
            <a href={contactLinks.email}>{siteConfig.email}</a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 md:items-start">
          <SocialLinks />
          <div className="text-sm text-muted">فكرتك تستاهل تتشاف.</div>
        </div>
      </Container>
    </footer>
  );
}
