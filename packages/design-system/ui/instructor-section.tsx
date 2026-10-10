import ActionLink from "./action-link";
import Container from "./container";
import Section from "./section";
import HeadingContext from "./heading-context";
import RichText from "./rich-text";
import InstructorPhoto from "./instructor-photo";
import InstructorStats from "./instructor-stats";
import type { InstructorContent } from "../types/marketing";

export default function InstructorSection({
  content,
  contextVariant = "badge",
  reveal = false,
}: {
  content: InstructorContent;
  contextVariant?: "badge" | "plain";
  reveal?: boolean;
}) {
  return (
    <Section {...content.section}>
      <Container className="instructor-layout">
        <InstructorPhoto
          reveal={reveal}
          image={content.image}
          badge={content.badge}
          experience={content.experience}
        />
        <div className="instructor-copy-column" data-reveal={reveal || undefined}>
          <HeadingContext variant={contextVariant}>{content.eyebrow}</HeadingContext>
          <h2 className="instructor-name">{content.name}</h2>
          <div className="instructor-tagline">{content.tagline}</div>
          <p className="instructor-manifesto">
            <RichText content={content.manifesto} />
          </p>
          <InstructorStats items={content.stats} />
          {content.action && (
            <div className="instructor-actions" data-instructor-actions>
              <ActionLink action={content.action} />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
