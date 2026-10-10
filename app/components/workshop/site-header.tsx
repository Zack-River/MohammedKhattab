"use client";

import { useInnerCorridor } from "@/app/hooks/use-inner-corridor";
import { useMobileNavigation } from "@/app/hooks/use-mobile-navigation";
import ScarcityBar from "./scarcity-bar";
import SiteNavigation from "./site-navigation";
import type { HeaderContent } from "@khatab/design/types/marketing";
import type { CountdownOptions } from "@khatab/design/types/interactions";

export default function SiteHeader({
  content,
  offer,
}: {
  content: HeaderContent;
  offer: CountdownOptions;
}) {
  const { navigationRef, isMenuOpen, setIsMenuOpen } = useMobileNavigation();
  useInnerCorridor(navigationRef);
  return (
    <header className="site-header" id={content.id} ref={navigationRef}>
      <ScarcityBar content={content} offer={offer} />
      <SiteNavigation
        content={content}
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onToggle={() => setIsMenuOpen(!isMenuOpen)}
      />
    </header>
  );
}
