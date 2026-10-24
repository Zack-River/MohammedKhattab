import Container from "./container";
import Section from "./section";
import SectionHeading from "./section-heading";
import CreatorMarquee from "./creator-marquee";
import ReelCard from "./reel-card";
import type { ClientsContent } from "../types/marketing";

export default function ClientsSection({
  content,
  reveal = false,
  showReels = true,
}: {
  content: ClientsContent;
  reveal?: boolean;
  showReels?: boolean;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <SectionHeading
          data-reveal={reveal || undefined}
          content={content.heading}
          className="clients-header"
          titleClassName="clients-single-line"
        />
        <CreatorMarquee items={content.creators} label={content.marqueeLabel} />
        {showReels && Boolean(content.reels?.length) && (
          <div className="reels-section-wrapper">
            {content.reelsTitle && (
              <div className="reels-header" data-reveal={reveal || undefined}>
                <h3 className="headline-h3 reels-title">{content.reelsTitle}</h3>
              </div>
            )}
            <div className="clients-grid reels-grid" data-reveal={reveal || undefined}>
              {content.reels.map((reel, index) => (
                <ReelCard key={index} {...reel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
