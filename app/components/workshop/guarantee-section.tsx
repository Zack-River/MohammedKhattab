import Card from "@/app/components/ui/card";
import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import type { JSX } from "react";
import Eyebrow from "./eyebrow";

export default function GuaranteeSection(): JSX.Element {
  return (
    <Section id="guarantee">
      <Container>
        <Card
          className="grid gap-6 border-s-4 border-s-brand p-6 sm:p-12 md:grid-cols-[auto_1fr] md:items-center md:gap-12 lg:p-16"
          data-motion="card"
        >
          <div className="mx-auto flex size-18 items-center justify-center rounded-lg border border-brand/35 bg-brand/10 text-brand [&_svg]:size-9 [&_svg]:fill-current">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
          <div className="flex flex-col gap-2 text-center md:text-start">
            <Eyebrow className="mb-2 self-center md:self-start">
              ضمان استرجاع 100%
            </Eyebrow>
            <Heading className="text-2xl font-bold">
              ضمان استرجاع أموالك
            </Heading>
            <p className="text-lead text-copy">
              في حالة لم نستطيع توفير لك أول عميل بعد 7 أيام يمكنك استرداد
              أموالك بالكامل.
            </p>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
