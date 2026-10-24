import Container from "./container";
import Section from "./section";
import SectionHeading from "./section-heading";
import CreatorMarquee from "./creator-marquee";
import ReelCard from "./reel-card";
import type { ClientsContent } from "../types/marketing";

export default function ClientsSection({
  content,
  reveal = false,
  showReels = false,
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
          <div className="clients-grid reels-grid" data-reveal={reveal || undefined}>
            {content.reels.map((reel, index) => (
              <ReelCard key={index} {...reel} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
