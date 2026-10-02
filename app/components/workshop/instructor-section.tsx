import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import Image from "next/image";
import { siteConfig } from "@/app/config/site";
import { instructorStats } from "@/app/data/workshop";
import AnimatedStat from "./animated-stat";
import ChapterLabel from "./chapter-label";

export default function InstructorSection() {
  return (
    <Section id="instructor">
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div data-motion="instructor-copy">
          <ChapterLabel index={4} />
          <Heading className="mb-6 text-chapter">
            مش هتتعلم
            <br />
            <span className="text-brand">لوحدك.</span>
          </Heading>
          <p className="mb-3 text-xl font-semibold">
            أنا محمد خطاب. وهكون معاك.
          </p>
          <p className="mb-9 max-w-lg text-lg leading-relaxed text-copy">
            فاكر أول مرة تفتح برنامج وتحس إنك تايه؟ هنعدّي المرحلة دي سوا. نشرح،
            نطبّق، ونسأل. ومش بس إزاي تعمل الفيديو، لكن ليه كل خطوة بتفرق.
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-line pt-7">
            {instructorStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2">
                <AnimatedStat {...stat} />
                <span className="text-xs leading-relaxed text-muted sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <a
            href="#testimonials"
            className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-soft hover:text-foreground"
          >
            اسمع من اللي جرّبوا قبل كده <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div
          className="relative mx-auto w-full max-w-sm pb-8"
          data-motion="instructor-photo"
        >
          <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-t-full bg-brand px-4 pt-8">
            <Image
              src={siteConfig.instructorImage.src}
              alt="محمد خطاب — مدرب المونتاج"
              data-instructor-image
              className="h-full w-full object-contain object-bottom"
              width={siteConfig.instructorImage.width}
              height={siteConfig.instructorImage.height}
              loading="lazy"
              decoding="async"
              unoptimized
            />
          </div>
          <div className="absolute inset-x-4 bottom-0 -rotate-3 border border-paper-line bg-paper px-6 py-4 text-ink shadow-paper">
            <p className="text-lg font-bold">محمد خطاب</p>
            <p className="text-xs text-paper-muted">
              Video editor · Founder of Ta3llam
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
