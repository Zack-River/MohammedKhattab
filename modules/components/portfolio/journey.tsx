"use client";
import { useRef } from "react";
import type { PortfolioContent } from "@platform/types/portfolio";
import { useTimelineProgress } from "@platform/hooks/portfolio/use-timeline-progress";
import PortfolioSection from "./section";
export default function PortfolioJourney({
  content,
}: {
  content: PortfolioContent["journey"];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useTimelineProgress(ref);
  return (
    <PortfolioSection content={content} className="p-ref-timeline-section">
      <div className="p-ref-timeline-wrap personal-timeline" ref={ref}>
        <div className="p-ref-timeline-track-line" aria-hidden="true">
          <div className="p-ref-timeline-progress-bar" />
        </div>
        <div className="p-ref-timeline-items">
          {content.items.map((item) => (
            <article
              className="p-ref-timeline-item"
              key={item.year}
              data-timeline-item
            >
              <div className="p-ref-timeline-marker-col">
                <div className="p-ref-timeline-node" aria-hidden="true" />
              </div>
              <div
                className="p-ref-timeline-content-card personal-milestone"
                data-reveal
              >
                <div className="p-ref-timeline-header-row">
                  <span className="p-ref-timeline-year-tag">{item.year}</span>
                  <h3 className="p-ref-timeline-title">{item.title}</h3>
                </div>
                <p className="p-ref-timeline-desc">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PortfolioSection>
  );
}
