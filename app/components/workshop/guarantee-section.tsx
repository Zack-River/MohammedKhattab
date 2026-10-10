import Container from "@khatab/design/ui/container";
import Section from "@khatab/design/ui/section";
import Eyebrow from "@khatab/design/ui/eyebrow";
import RichText from "@khatab/design/ui/rich-text";
import Icon from "@khatab/design/ui/ui-icon";
import type { GuaranteeContent } from "@khatab/design/types/marketing";

export default function GuaranteeSection({
  content,
}: {
  content: GuaranteeContent;
}) {
  return (
    <Section {...content.section}>
      <Container>
        <div className="guarantee-card">
          <div className="guarantee-icon-box">
            <Icon name="shield" />
          </div>
          <div className="guarantee-copy">
            <Eyebrow className="guarantee-eyebrow">
              {content.heading.eyebrow}
            </Eyebrow>
            <h2 className="guarantee-headline">
              <RichText content={content.heading.title} />
            </h2>
            {content.heading.description && (
              <p className="guarantee-text">
                <RichText content={content.heading.description} />
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
