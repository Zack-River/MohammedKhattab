import Container from "@khatab/design/ui/container";
import Section from "@khatab/design/ui/section";
import Eyebrow from "@khatab/design/ui/eyebrow";
import RichText from "@khatab/design/ui/rich-text";
import ActionLink from "@khatab/design/ui/action-link";
import Microcopy from "@khatab/design/ui/microcopy";
import type { FinalCtaContent } from "@khatab/design/types/marketing";

export default function FinalCtaSection({
  content,
}: {
  content: FinalCtaContent;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <div className="final-cta-box">
          <Eyebrow>{content.heading.eyebrow}</Eyebrow>
          <h2 className="headline-h2 final-cta-headline">
            <RichText content={content.heading.title} />
          </h2>
          {content.heading.description && (
            <p className="final-cta-sub">
              <RichText content={content.heading.description} />
            </p>
          )}
          <div className="final-btn-wrapper">
            <ActionLink action={content.action} />
            <Microcopy items={content.microcopy} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
