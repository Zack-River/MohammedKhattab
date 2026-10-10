import Container from "./container";
import Section from "./section";
import HeadingContext from "./heading-context";
import RichText from "./rich-text";
import TransformationStage from "./transformation-stage";
import type { TransformationContent } from "../types/marketing";

export default function TransformationSection({
  content,
  contextVariant = "badge",
  reveal = false,
}: {
  content: TransformationContent;
  contextVariant?: "badge" | "plain";
  reveal?: boolean;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <div className="transform-header" data-reveal={reveal || undefined}>
          <HeadingContext variant={contextVariant}>{content.heading.eyebrow}</HeadingContext>
          <div className="transformation-frame-card">
            <h2 className="headline-h2 transform-headline">
              <RichText content={content.heading.title} />
            </h2>
          </div>
          {content.heading.description && (
            <p className="body-large transform-lead-text">
              <RichText content={content.heading.description} />
            </p>
          )}
        </div>
        <div className="transform-stages-grid">
          {content.stages.map((stage, index) => (
            <TransformationStage key={index} reveal={reveal} {...stage} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
