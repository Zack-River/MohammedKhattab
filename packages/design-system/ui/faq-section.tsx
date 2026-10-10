import Container from "./container";
import Section from "./section";
import SectionHeading from "./section-heading";
import FaqAccordion from "./faq-accordion";
import type { FaqContent } from "../types/marketing";

export default function FaqSection({ content, contextVariant = "badge", reveal = false }: { content: FaqContent; contextVariant?: "badge" | "plain"; reveal?: boolean }) {
  return (
    <Section {...content.section}>
      <Container>
        <SectionHeading content={content.heading} className="faq-header" contextVariant={contextVariant} data-reveal={reveal || undefined} />
        <FaqAccordion items={content.items} reveal={reveal} />
      </Container>
    </Section>
  );
}
