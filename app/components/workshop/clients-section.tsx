import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import { clientReels, creators } from "@/app/data/workshop";
import ChapterLabel from "./chapter-label";
import CreatorChip from "./creator-chip";
import EditPreview from "./edit-preview";
import HorizontalShowcase from "./horizontal-showcase";
import ReelCard from "./reel-card";
import HeroVideo from "./hero-video";
import { WORKSHOP_VIDEO_URL } from "@/app/data/workshop";

export default function ClientsSection() {
  return (
    <Section id="clients">
      <Container>
        <div
          className="mb-10 max-w-reading"
          data-motion="header"
          data-motion-children
        >
          <ChapterLabel index={2} />
          <Heading className="mb-5 text-chapter">
            الفرجة حلوة.
            <br />
            <span className="text-brand">التجربة أحلى.</span>
          </Heading>
          <p className="max-w-lg text-lg text-copy">
            مش محتاج برنامج عشان تلاحظ الفرق. جرّب تختار، وشوف النتيجة.
          </p>
        </div>
        <EditPreview />
        <div className="mt-14 grid grid-cols-1 items-center gap-8 rounded-2xl border border-line-strong p-5 sm:p-8 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm text-brand-soft">من شغل محمد الحقيقي</p>
            <h3 className="mb-4 text-3xl font-bold">
              شوف القرارات دي
              <br />
              في فيديو كامل.
            </h3>
            <p className="text-copy">
              تجربة القهوة كانت للتدريب. هنا مثال منشور من قناة محمد خطاب: شوف
              أسلوبه في التقطيع، والعناوين، وإيقاع الفيديو.
            </p>
          </div>
          <HeroVideo videoUrl={WORKSHOP_VIDEO_URL} />
        </div>
        <div className="my-14 border-y border-line py-7">
          <p className="mb-5 text-sm text-muted">
            وخبرة عملية مع صناع محتوى في الوطن العربي
          </p>
          <div
            className="flex flex-wrap items-center gap-3"
            aria-label="صناع المحتوى"
          >
            {creators.map((creator) => (
              <CreatorChip key={creator.name} {...creator} />
            ))}
          </div>
        </div>
        <HorizontalShowcase count={clientReels.length}>
          {clientReels.map((reel, index) => (
            <ReelCard
              key={reel.format}
              index={index}
              total={clientReels.length}
              {...reel}
            />
          ))}
        </HorizontalShowcase>
      </Container>
    </Section>
  );
}
