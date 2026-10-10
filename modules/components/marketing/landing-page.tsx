import ClientsSection from "@khatab/design/ui/clients-section";
import TestimonialsSection from "@khatab/design/ui/testimonials-section";
import ClosingSection from "@platform/components/marketing/closing-section";
import CoachingSection from "@platform/components/marketing/coaching-section";
import CourseShowcase from "@platform/components/marketing/course-showcase";
import SkillStrip from "@platform/components/marketing/skill-strip";
import SiteHeader from "@platform/components/layout/site-header";
import SiteFooter from "@platform/components/layout/site-footer";
import LandingHero from "@platform/components/marketing/landing-hero";
import InstructorSection from "@khatab/design/ui/instructor-section";
import TransformationSection from "@khatab/design/ui/transformation-section";
import FaqSection from "@khatab/design/ui/faq-section";
import { Fragment, type ComponentProps } from "react";
import RevealContent from "./reveal-content";
export interface LandingModel {
  header?: ComponentProps<typeof SiteHeader>;
  hero: ComponentProps<typeof LandingHero>;
  workSamples?: ComponentProps<typeof ClientsSection>;
  testimonials?: ComponentProps<typeof TestimonialsSection>;
  skills: ComponentProps<typeof SkillStrip>;
  courses: ComponentProps<typeof CourseShowcase>;
  steps: ComponentProps<typeof TransformationSection>;
  instructor: ComponentProps<typeof InstructorSection>;
  coaching: ComponentProps<typeof CoachingSection>;
  faq: ComponentProps<typeof FaqSection>;
  closing: ComponentProps<typeof ClosingSection>;
  footer?: ComponentProps<typeof SiteFooter>;
  order?: readonly LandingSection[];
  motion?: boolean;
}
export type LandingSection =
  | "hero"
  | "workSamples"
  | "testimonials"
  | "skills"
  | "courses"
  | "steps"
  | "instructor"
  | "coaching"
  | "faq"
  | "closing";
const defaultOrder: readonly LandingSection[] = [
  "hero",
  "skills",
  "courses",
  "workSamples",
  "steps",
  "instructor",
  "coaching",
  "testimonials",
  "faq",
  "closing",
];
export default function LandingPage({ model }: { model: LandingModel }) {
  const sections = {
    hero: <LandingHero {...model.hero} />,
    workSamples: model.workSamples && <ClientsSection {...model.workSamples} />,
    testimonials: model.testimonials && <TestimonialsSection {...model.testimonials} />,
    skills: <SkillStrip {...model.skills} />,
    courses: <CourseShowcase {...model.courses} />,
    steps: <TransformationSection contextVariant="plain" reveal {...model.steps} />,
    instructor: <InstructorSection contextVariant="plain" reveal {...model.instructor} />,
    coaching: <CoachingSection {...model.coaching} />,
    faq: <FaqSection contextVariant="plain" reveal {...model.faq} />,
    closing: <ClosingSection {...model.closing} />,
  };
  return (
    <>
      {model.header && <SiteHeader {...model.header} />}
      <RevealContent motion={model.motion ?? true}>
        {(model.order ?? defaultOrder).map((key) => (
          <Fragment key={key}>{sections[key]}</Fragment>
        ))}
      </RevealContent>
      {model.footer && <SiteFooter {...model.footer} />}
    </>
  );
}
