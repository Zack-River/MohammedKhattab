import Card from "@/app/components/ui/card";
import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import { editingBeats } from "@/app/data/journey";
import ChapterLabel from "./chapter-label";
import EditingDesk from "./editing-desk";
import EditingStory from "./editing-story";

export default function TransformationSection() {
  return (
    <Section id="transformation" className="bg-paper text-ink">
      <Container>
        <div
          className="mb-12 max-w-reading"
          data-motion="header"
          data-motion-children
        >
          <ChapterLabel index={1} paper />
          <Heading className="mb-5 text-chapter font-bold">
            تعالى نشوف فكرة
            <br />
            <span className="text-brand">بتتحوّل لإيه.</span>
          </Heading>
          <p className="max-w-lg text-lg text-paper-muted">
            المونتاج مش أزرار كتير. هو قرارات صغيرة بتخلّي فكرتك توصل.
          </p>
        </div>
        <EditingStory desk={<EditingDesk />}>
          <div data-motion="grid" className="flex flex-col gap-8 lg:gap-12">
            {editingBeats.map((beat) => (
              <Card
                as="article"
                interactive
                key={beat.number}
                className="flex flex-col justify-center rounded-none border-0 border-b border-paper-line bg-transparent px-0 py-8 shadow-none sm:px-0 sm:py-10 lg:min-h-story-beat hover:border-paper-line hover:shadow-none"
              >
                <span className="mb-6 text-sm text-brand tabular-nums">
                  / {beat.number}
                </span>
                <h3 className="mb-5 text-3xl leading-snug font-bold sm:text-4xl">
                  {beat.title}
                </h3>
                <p className="mb-6 max-w-md text-lg leading-relaxed text-paper-muted">
                  {beat.text}
                </p>
                <span className="inline-flex w-fit items-center gap-2 text-sm font-semibold">
                  <span className="text-brand" aria-hidden="true">
                    ↗
                  </span>
                  {beat.result}
                </span>
              </Card>
            ))}
          </div>
        </EditingStory>
        <a
          href="#clients"
          className="mt-14 flex items-center justify-between gap-4 border-t border-paper-line pt-6 text-lg font-semibold hover:text-brand"
        >
          <span>عرفت الفكرة؟ دلوقتي جرّب بنفسك.</span>
          <span aria-hidden="true">↓</span>
        </a>
      </Container>
    </Section>
  );
}
