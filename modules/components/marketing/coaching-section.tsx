import Section from "@khatab/design/ui/section";
import SectionHeading from "@platform/components/ui/section-heading";
import Symbol, { type SymbolName } from "@platform/components/ui/symbol";
import type { SectionHeadingContent } from "@khatab/design/types/ui";
import type { ComponentProps } from "react";
export interface CoachingModel {
  content: SectionHeadingContent;
  benefits: readonly {
    id: string;
    title: string;
    body: string;
    symbol: SymbolName;
  }[];
  section: ComponentProps<typeof Section>;
}
export default function CoachingSection({
  content,
  benefits,
  section,
}: CoachingModel) {
  return (
    <Section {...section}>
      <div className="container lms-benefits-grid">
        <SectionHeading content={content} data-reveal />
        <div className="lms-benefit-list">
          {benefits.map((item) => (
            <div key={item.id} data-reveal>
              <Symbol name={item.symbol} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
