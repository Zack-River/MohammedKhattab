import { routes } from "@platform/config/navigation";
import type { MarketingPageContent } from "@khatab/design/types/marketing";
import type { Course } from "@platform/types/lms";
import { courseIntroVideo } from "./course-intro-video";
import { paymentCopy } from "@platform/data/payment-copy";
export function workshopCourseContent(
  content: MarketingPageContent,
  course: Course,
  defaults: Course,
): MarketingPageContent {
  const action =
    course.offer.amount > 0 ? { href: routes.checkout(course.slug), label: paymentCopy.subscribe } : undefined;
  return {
    ...content,
    header: { ...content.header, action: action ?? content.header.action },
    roadmap: { ...content.roadmap, action: action ?? content.roadmap.action },
    finalCta: { ...content.finalCta, action: action ?? content.finalCta.action },
    hero: {
      ...content.hero,
      video: courseIntroVideo(content.hero.video, course, defaults),
      action: action ?? content.hero.action,
      title: course.title === defaults.title ? content.hero.title : [course.title],
      description: course.description === defaults.description ? content.hero.description : course.description,
    },
  };
}
