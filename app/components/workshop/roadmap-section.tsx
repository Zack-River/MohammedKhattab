import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import { roadmapDays } from "@/app/data/workshop";
import ChapterLabel from "./chapter-label";
import RoadmapTimeline from "./roadmap-timeline";
import LessonOutcomes from "./lesson-outcomes";

export default function RoadmapSection() {
  return (
    <Section id="roadmap" className="bg-paper text-ink">
      <Container>
        <div
          className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
          data-motion="header"
          data-motion-children
        >
          <div>
            <ChapterLabel index={3} paper />
            <Heading className="text-chapter font-bold">
              مش طريق طويل.
              <br />
              <span className="text-brand">سبع خطوات واضحة.</span>
            </Heading>
          </div>
          <div className="max-w-sm">
            <p className="mb-4 text-lg leading-relaxed text-paper-muted">
              كل يوم هتفهم حاجة وتعمل حاجة. من أول مرة تفتح البرنامج، لحد شغل
              تقدر تعرضه.
            </p>
            <p className="text-sm font-semibold text-ink">
              شرح مباشر + تسجيلات + تطبيق عملي
            </p>
          </div>
        </div>
        <div
          className="film-perforations mb-8 h-2 rounded bg-ink"
          aria-hidden="true"
        />
        <LessonOutcomes />
        <RoadmapTimeline days={roadmapDays} />
        <a
          href="#instructor"
          className="mt-14 flex items-center justify-between gap-4 border-t border-paper-line pt-6 text-lg font-semibold hover:text-brand"
        >
          <span>طيب مين هيمشي معاك الخطوات دي؟</span>
          <span aria-hidden="true">↓</span>
        </a>
      </Container>
    </Section>
  );
}
