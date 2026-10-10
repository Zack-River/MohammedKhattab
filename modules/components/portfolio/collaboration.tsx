import type { PortfolioContent } from "@platform/types/portfolio";
import PortfolioActions from "./actions";
export default function PortfolioCollaboration({
  content,
}: {
  content: PortfolioContent["collaboration"];
}) {
  return (
    <section
      id={content.id}
      className="p-ref-collab-section personal-section"
      aria-labelledby={`${content.id}-title`}
    >
      <div className="p-ref-container personal-container">
        <div className="p-ref-collab-box personal-collaboration" data-reveal>
          <div className="p-ref-section-eyebrow">{content.eyebrow}</div>
          <h2 className="p-ref-collab-headline" id={`${content.id}-title`}>
            {content.title}
          </h2>
          <p className="p-ref-collab-copy">{content.description}</p>
          <PortfolioActions actions={content.actions} collaboration />
        </div>
      </div>
    </section>
  );
}
