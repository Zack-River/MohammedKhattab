import Container from "@khatab/design/ui/container";
import ActionLink from "@khatab/design/ui/action-link";
import Section from "@khatab/design/ui/section";
import SectionHeading from "@khatab/design/ui/section-heading";
import RoadmapTimeline from "./roadmap-timeline";
import RoadmapFormula from "./roadmap-formula";
import type { RoadmapContent } from "@khatab/design/types/marketing";

export default function RoadmapSection({
  content,
}: {
  content: RoadmapContent;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <SectionHeading
          content={content.heading}
          className="roadmap-header"
          titleClassName="roadmap-title"
          descriptionClassName="roadmap-intro"
        >
          <RoadmapFormula {...content.formula} />
        </SectionHeading>
        <RoadmapTimeline days={content.days} />
        <div className="roadmap-bottom-cta">
          <ActionLink action={content.action} />
        </div>
      </Container>
    </Section>
  );
}
