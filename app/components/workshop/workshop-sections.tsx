import { Fragment } from "react";
import HeroSection from "./hero-section";
import ClientsSection from "@khatab/design/ui/clients-section";
import TransformationSection from "@khatab/design/ui/transformation-section";
import RoadmapSection from "./roadmap-section";
import TestimonialsSection from "@khatab/design/ui/testimonials-section";
import InstructorSection from "@khatab/design/ui/instructor-section";
import GuaranteeSection from "./guarantee-section";
import FaqSection from "@khatab/design/ui/faq-section";
import FinalCtaSection from "./final-cta-section";
import type { MarketingPageContent } from "@khatab/design/types/marketing";
import type { WorkshopSectionKey } from "@khatab/design/types/marketing";
export default function WorkshopSections({content,order}:{content:MarketingPageContent;order:readonly WorkshopSectionKey[]}) {
 const sections={hero:<HeroSection content={content.hero} />,clients:<ClientsSection content={content.clients} />,transformation:<TransformationSection content={content.transformation} />,roadmap:<RoadmapSection content={content.roadmap} />,testimonials:<TestimonialsSection content={content.testimonials} />,instructor:<InstructorSection content={content.instructor} />,guarantee:<GuaranteeSection content={content.guarantee} />,faq:<FaqSection content={content.faq} />,finalCta:<FinalCtaSection content={content.finalCta} />};
 return order.map(key=><Fragment key={key}>{sections[key]}</Fragment>);
}
