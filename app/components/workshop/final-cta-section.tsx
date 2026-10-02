import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";
import ChapterLabel from "./chapter-label";
import WhatsAppCta from "./whatsapp-cta";
import FinalEdit from "./final-edit";

export default function FinalCtaSection() {
  return (
    <Section id="enroll" className="overflow-hidden bg-brand text-foreground">
      <Container>
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <ChapterLabel index={5} inverse />
          <span className="rounded-full border border-foreground/30 px-4 py-2 text-sm">
            وصلت لآخر الرحلة ✓
          </span>
        </div>
        <div className="mb-12 max-w-2xl">
          <FinalEdit />
        </div>
        <div
          data-motion="card"
          className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end"
        >
          <Heading className="text-display font-bold">
            الفكرة لسه عندك؟
            <br />
            <span className="text-canvas">دلوقتي دورك.</span>
          </Heading>
          <div className="pb-3">
            <p className="mb-8 max-w-md text-xl leading-relaxed">
              بدأنا بفكرة. وشفت الخطوات، والتطبيق، والناس اللي هتكون معاك. أول
              فيديو ليك بيبدأ بأول خطوة.
            </p>
            <WhatsAppCta
              showArrow
              className="border-canvas bg-canvas shadow-none focus-visible:outline-foreground hover:bg-ink hover:shadow-none"
            >
              خد أول خطوة — كلّم محمد
            </WhatsAppCta>
            <p className="mt-4 text-sm text-foreground/80">
              اسأل عن تفاصيل الورشة قبل ما تقرر.
            </p>
          </div>
        </div>
        <div className="mt-14 flex items-center justify-between border-t border-foreground/25 pt-5 text-sm">
          <span>7 أيام. تطبيق بإيدك. وبداية جديدة.</span>
          <a href="#hero" className="hover:text-canvas">
            نرجع لأول فكرة ↑
          </a>
        </div>
      </Container>
    </Section>
  );
}
