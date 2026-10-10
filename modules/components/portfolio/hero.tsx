import AssetImage from "@khatab/design/ui/asset-image";
import type { PortfolioContent } from "@platform/types/portfolio";
import PortfolioActions from "./actions";
export default function PortfolioHero({
  content,
}: {
  content: PortfolioContent["hero"];
}) {
  return (
    <section
      id={content.id}
      className="p-ref-hero-section personal-hero"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="p-ref-container p-ref-hero-grid personal-container personal-hero-grid">
        <div className="p-ref-hero-content" data-reveal-group="hero">
          <div className="p-ref-hero-eyebrow" data-reveal>
            <span>{content.eyebrow}</span>
          </div>
          <h1 className="p-ref-hero-headline" id={`${content.id}-title`} data-reveal>
            {content.title}
          </h1>
          <p className="p-ref-hero-description" data-reveal>
            {content.description}
          </p>
          <div data-reveal>
            <PortfolioActions actions={content.actions} />
          </div>
        </div>
        <div className="p-ref-hero-visual-wrapper" data-reveal>
          <div className="p-ref-hero-halo" aria-hidden="true" />
          <div className="p-ref-hero-image-frame personal-portrait">
            <AssetImage
              asset={content.image}
              loading="eager"
              fetchPriority="high"
            />
            <div
              className="p-ref-hero-micro-pill personal-stats"
              aria-label={content.statsLabel}
            >
              <span className="p-ref-hero-micro-dot" aria-hidden="true" />
              <span className="p-ref-hero-micro-text">{content.stats}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
