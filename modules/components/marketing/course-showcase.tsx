import { routes, sectionIds } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
import SectionHeading from "@platform/components/ui/section-heading";
import CourseGrid from "@platform/components/courses/course-grid";
import Symbol from "@platform/components/ui/symbol";
export default function CourseShowcase({
  copy,
  site,
  offerCopy,
  interfaceCopy,
  courses,
  actionHref = routes.courses,
  sectionId = sectionIds.courses,
}: {
  actionHref?: string;
  sectionId?: string;
  copy: Pick<ContentBindings["copy"], "lessons" | "continue" | "progress">;
  site: Pick<ContentBindings["site"], "englishName">;
  offerCopy: Pick<ContentBindings["offerCopy"], "price">;
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    | "showcaseTitle"
    | "showcaseHighlight"
    | "showcaseDescription"
    | "showcaseAction"
  >;
  courses: import("@platform/types/lms").Course[];
}) {
  return (
    <section className="section section-alt" id={sectionId}>
      <div className="container">
        <div className="lms-section-top lms-reveal" data-reveal>
          <SectionHeading
            content={{
              title: [
                interfaceCopy.showcaseTitle,
                {
                  kind: "span",
                  className: "highlight-red",
                  children: [interfaceCopy.showcaseHighlight],
                },
              ],
              description: [interfaceCopy.showcaseDescription],
            }}
          />
          <Link href={actionHref} className="lms-text-link">
            {interfaceCopy.showcaseAction}
            <Symbol name="arrow" />
          </Link>
        </div>
        <CourseGrid
          copy={{
            lessons: copy.lessons,
            continue: copy.continue,
            progress: copy.progress,
          }}
          site={{ englishName: site.englishName }}
          offerCopy={{ price: offerCopy.price }}
          courses={courses}
        />
      </div>
    </section>
  );
}
