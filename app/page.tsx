import type { JSX } from "react";
import ClientsSection from "@/app/components/workshop/clients-section";
import FaqSection from "@/app/components/workshop/faq-section";
import FinalCtaSection from "@/app/components/workshop/final-cta-section";
import GuaranteeSection from "@/app/components/workshop/guarantee-section";
import HeroSection from "@/app/components/workshop/hero-section";
import InstructorSection from "@/app/components/workshop/instructor-section";
import RoadmapSection from "@/app/components/workshop/roadmap-section";
import SiteFooter from "@/app/components/workshop/site-footer";
import SiteHeader from "@/app/components/workshop/site-header";
import TestimonialsSection from "@/app/components/workshop/testimonials-section";
import TransformationSection from "@/app/components/workshop/transformation-section";
import WorkshopMotion from "@/app/components/workshop-motion";

export default function Home(): JSX.Element {
  return (
    <WorkshopMotion>
      <SiteHeader />
      <main>
        <HeroSection />
        <TransformationSection />
        <ClientsSection />
        <RoadmapSection />
        <InstructorSection />
        <TestimonialsSection />
        <GuaranteeSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </WorkshopMotion>
  );
}
