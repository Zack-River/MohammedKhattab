import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
import SectionHeading from "@platform/components/ui/section-heading";
import Symbol from "@platform/components/ui/symbol";
export default function ClosingSection({
  interfaceCopy,
  actionHref = routes.courses,
}: {
  actionHref?: string;
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    "closingTitle" | "closingHighlight" | "closingDescription" | "closingAction"
  >;
}) {
  return (
    <section className="section final-cta-section">
      <div className="container">
        <div className="final-cta-box lms-reveal" data-reveal>
          <SectionHeading
            content={{
              title: [
                interfaceCopy.closingTitle,
                {
                  kind: "span",
                  className: "highlight-red",
                  children: [interfaceCopy.closingHighlight],
                },
              ],
              description: [interfaceCopy.closingDescription],
            }}
          />
          <Link href={actionHref} className="btn-primary">
            {interfaceCopy.closingAction}
            <Symbol name="arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
