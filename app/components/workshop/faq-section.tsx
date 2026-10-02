import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import type { JSX } from "react";
import FaqAccordion from "./faq-accordion";
import { faqItems } from "@/app/data/workshop";
import Eyebrow from "./eyebrow";

export default function FaqSection(): JSX.Element {
  return (
    <Section alternate id="faq">
      <Container>
        <div
          className="mb-12 text-center md:mb-16"
          data-motion="header"
          data-motion-children
        >
          <Eyebrow>الأسئلة الشائعة</Eyebrow>
          <Heading className="text-heading font-bold tracking-tight">
            إجابات واضحة لكل تساؤلاتك
          </Heading>
        </div>

        <FaqAccordion items={faqItems} />
      </Container>
    </Section>
  );
}
