"use client";

import Container from "@/app/components/ui/container";
import { navigationLinks } from "@/app/data/workshop";
import { siteConfig } from "@/app/config/site";
import { useMobileNavigation } from "@/app/hooks/use-mobile-navigation";
import { scrollToPageTop } from "@/app/lib/navigation";
import WhatsAppCta from "./whatsapp-cta";

export default function SiteHeader() {
  const { isMenuOpen, setIsMenuOpen, navigationRef, menuId } =
    useMobileNavigation();
  return (
    <header className="sticky top-0 z-50 w-full bg-canvas" ref={navigationRef}>
      <nav
        className="relative border-b border-line bg-canvas"
        aria-label="شريط التنقل الرئيسي"
      >
        <Container className="flex min-h-20 items-center justify-between gap-3 lg:gap-5">
          <a
            href="#hero"
            className="shrink-0 text-base font-extrabold tracking-tight transition-colors hover:text-brand sm:text-xl"
            onClick={(event) => {
              setIsMenuOpen(false);
              scrollToPageTop(event);
            }}
          >
            {siteConfig.name}
          </a>
          <ul
            id={menuId}
            data-navigation
            data-open={isMenuOpen}
            className="absolute inset-x-4 top-full mt-2 hidden -translate-y-2 flex-col gap-1 opacity-0 transition-[opacity,translate,display] transition-discrete duration-200 ease-out motion-reduce:transition-none rounded-xl border border-line bg-panel p-3 shadow-card data-[open=true]:flex data-[open=true]:translate-y-0 data-[open=true]:opacity-100 starting:opacity-0 starting:-translate-y-2 lg:static lg:translate-y-0 lg:opacity-100 lg:starting:opacity-100 lg:starting:translate-y-0 lg:mt-0 lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
          >
            {navigationLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="relative block rounded-lg px-3 py-2 text-sm font-semibold text-copy transition-colors hover:bg-elevated hover:text-foreground lg:px-2 lg:hover:bg-transparent lg:hover:text-brand after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-right after:scale-x-0 after:bg-brand after:transition-transform after:duration-200 lg:hover:after:scale-x-100 lg:focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
                  onClick={(event) => {
                    setIsMenuOpen(false);
                    if (href === "#hero") scrollToPageTop(event);
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <WhatsAppCta compact onClick={() => setIsMenuOpen(false)}>
              احجز مكانك
            </WhatsAppCta>
            <button
              data-menu-toggle
              className="inline-flex size-11 items-center justify-center rounded border border-line bg-panel text-foreground transition-[scale,background-color,border-color] duration-200 hover:border-brand/40 hover:bg-elevated motion-safe:active:scale-95 motion-reduce:scale-none motion-reduce:transition-none lg:hidden"
              type="button"
              aria-label={isMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={isMenuOpen}
              aria-controls={menuId}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <svg
                className="size-5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </Container>
      </nav>
    </header>
  );
}
