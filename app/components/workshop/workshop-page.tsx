import SiteHeader from "@/app/components/workshop/site-header";
import WorkshopContent from "@/app/components/workshop/workshop-content";
import SiteFooter from "@/app/components/workshop/site-footer";
import RecentSignupToast from "@/app/components/workshop/recent-signup-toast";
import HeroSection from "@/app/components/workshop/hero-section";
import ClientsSection from "@khatab/design/ui/clients-section";
import TransformationSection from "@khatab/design/ui/transformation-section";
import RoadmapSection from "@/app/components/workshop/roadmap-section";
import TestimonialsSection from "@khatab/design/ui/testimonials-section";
import InstructorSection from "@khatab/design/ui/instructor-section";
import GuaranteeSection from "@/app/components/workshop/guarantee-section";
import FaqSection from "@khatab/design/ui/faq-section";
import FinalCtaSection from "@/app/components/workshop/final-cta-section";

import type { MarketingPageContent } from "@khatab/design/types/marketing";

export default function WorkshopPage({
  content,
}: {
  content: MarketingPageContent;
}) {
  return (
    <>
      <SiteHeader content={content.header} offer={content.offer} />
      <WorkshopContent motion={content.motion}>
        <HeroSection content={content.hero} />
        <ClientsSection content={content.clients} />
        <TransformationSection content={content.transformation} />
        <RoadmapSection content={content.roadmap} />
        <TestimonialsSection content={content.testimonials} />
        <InstructorSection content={content.instructor} />
        <GuaranteeSection content={content.guarantee} />
        <FaqSection content={content.faq} />
        <FinalCtaSection content={content.finalCta} />
      </WorkshopContent>
      <SiteFooter content={content.footer} />
      <RecentSignupToast
        content={content.signup.content}
        options={content.signup.options}
      />
    </>
  );
}
