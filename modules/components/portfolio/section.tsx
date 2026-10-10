import type { ReactNode } from "react";
import type { PortfolioHeading } from "@platform/types/portfolio";
export default function PortfolioSection({
  content,
  children,
  className = "",
  headingClassName = "",
}: {
  content: PortfolioHeading;
  children: ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <section
      id={content.id}
      className={`personal-section ${className}`}
      aria-labelledby={`${content.id}-title`}
    >
      <div className="p-ref-container personal-container">
        <header
          className="p-ref-section-header personal-section-heading"
          data-reveal
        >
          <div className="p-ref-section-eyebrow">{content.eyebrow}</div>
          <h2
            className={`p-ref-section-title ${headingClassName}`}
            id={`${content.id}-title`}
          >
            {content.title}
          </h2>
          <p className="p-ref-section-subtitle">{content.description}</p>
        </header>
        {children}
      </div>
    </section>
  );
}
