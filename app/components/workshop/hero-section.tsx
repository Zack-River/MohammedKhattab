import Image from "next/image";
import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import { siteConfig } from "@/app/config/site";
import ChapterLabel from "./chapter-label";
import ClipPreview from "./clip-preview";
import ClipCredit from "./clip-credit";
import WhatsAppCta from "./whatsapp-cta";

export default function HeroSection() {
  return (
    <Section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div className="relative z-10">
            <ChapterLabel index={0} />
            <Heading
              as="h1"
              className="mb-7 text-display font-bold tracking-tight"
              data-motion="hero-heading"
            >
              أول فيديو؟
              <br />
              <span className="text-brand">بيبدأ هنا.</span>
            </Heading>
            <p
              className="mb-8 max-w-lg text-lg leading-relaxed text-copy"
              data-motion="hero-copy"
            >
              لقطة قهوة عادية. ممكن تبقى إيه؟
              <br />
              انزل نشوفها بتتحوّل، جرّب قرار بإيدك، وشوف نتيجتك في الآخر. مونتاج
              من الصفر، خطوة بخطوة مع محمد خطاب.
            </p>
            <div
              data-motion="hero-cta"
              className="flex flex-col items-start gap-4"
            >
              <WhatsAppCta showArrow>ابدأ رحلتك مع محمد خطاب</WhatsAppCta>
              <p className="text-sm text-muted">
                للمبتدئين والطلاب · 7 أيام من التعلّم والتطبيق
              </p>
            </div>
            <a
              href="#transformation"
              className="mt-10 inline-flex items-center gap-3 text-sm text-copy hover:text-brand-soft"
            >
              <span
                className="flex size-10 items-center justify-center rounded-full border border-line-strong"
                aria-hidden="true"
              >
                ↓
              </span>
              انزل وشوف الفكرة بتتحوّل إزاي
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-xl pb-12">
            <div className="mb-5 flex items-center justify-between text-xs text-muted">
              <span>لقطتنا قبل المونتاج</span>
              <span dir="ltr">PLAY / LEARN / MAKE</span>
            </div>
            <div className="rounded-2xl border border-paper-line bg-paper p-3 shadow-cutout motion-safe:-rotate-2">
              <div data-motion="hero-video">
                <ClipPreview stage="raw" />
              </div>
              <p className="px-2 pt-3 pb-1 text-sm font-semibold text-ink">
                8 ثواني عادية. خلّينا نشوف نقدر نعمل بيها إيه.
              </p>
            </div>
            <ClipCredit />
            <div className="relative mt-5 ms-auto flex w-fit items-center gap-3 rounded-full border border-line-strong bg-canvas py-2 pe-5 ps-2 shadow-card">
              <div className="relative size-14 overflow-hidden rounded-full bg-brand">
                <Image
                  src={siteConfig.instructorImage.src}
                  alt="محمد خطاب"
                  fill
                  className="object-cover object-top"
                  sizes="56px"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-sm font-bold">محمد خطاب</p>
                <p className="text-xs text-muted">مدربك في الرحلة دي</p>
              </div>
            </div>
            <div
              className="absolute -start-2 -top-6 flex size-20 -rotate-12 flex-col items-center justify-center rounded-full bg-brand text-foreground sm:-start-5 sm:size-24"
              aria-hidden="true"
            >
              <span className="text-3xl leading-none font-bold">7</span>
              <span className="mt-1 text-xs">أيام. ونبدأ.</span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
