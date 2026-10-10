import type { PortfolioContent } from "@platform/types/portfolio";
import { highlightText } from "@platform/helpers/portfolio/highlight-text";
import { Fragment } from "react";
import PortfolioSection from "./section";
export default function PortfolioAbout({
  content,
}: {
  content: PortfolioContent["about"];
}) {
  const parts = highlightText(content.body, content.emphasis);
  return (
    <PortfolioSection
      content={content}
      className="p-ref-about-section"
      headingClassName="p-ref-section-title-single-line"
    >
      <div className="p-ref-about-editorial-layout personal-about-grid">
        <div className="p-ref-about-quote-col" data-reveal>
          <blockquote className="p-ref-about-lead-quote">
            {content.quote}
          </blockquote>
        </div>
        <div className="p-ref-about-body-copy">
          <p className="p-ref-about-paragraph" data-reveal>
            {parts.map((part, index) => part.highlighted
              ? <strong key={index}>{part.text}</strong>
              : <Fragment key={index}>{part.text}</Fragment>)}
          </p>
          <div className="p-ref-about-values-grid personal-values">
            {content.values.map((value) => (
              <article
                className="p-ref-about-value-item personal-value"
                key={value.number}
                data-reveal
              >
                <div className="p-ref-about-value-num">{value.number}</div>
                <h3 className="p-ref-about-value-title">{value.title}</h3>
                <p className="p-ref-about-value-desc">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PortfolioSection>
  );
}
