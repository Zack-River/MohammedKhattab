import { offerBaseAmount } from "@platform/features/commerce/helpers/offer-base-amount";
import { routes } from "@platform/config/navigation";
import type { MarketingPageContent } from "@khatab/design/types/marketing";
import type { Course } from "@platform/types/lms";
import { courseIntroVideo } from "./course-intro-video";
import { paymentCopy } from "@platform/data/payment-copy";
import { featuredWorkshopRoadmap } from "./featured-workshop-roadmap";
export function workshopCourseContent(
  content: MarketingPageContent,
  course: Course,
  defaults: Course,
): MarketingPageContent {
  const action =
    offerBaseAmount(course.offer) > 0 ? { href: routes.checkout(course.slug), label: paymentCopy.subscribe } : undefined;
  return {
    ...content,
    header: { ...content.header, action: action ?? content.header.action },
    roadmap: { ...featuredWorkshopRoadmap(content.roadmap,course,defaults.slug), action: action ?? content.roadmap.action },
    finalCta: { ...content.finalCta, action: action ?? content.finalCta.action },
    hero: {
      ...content.hero,
      video: courseIntroVideo(content.hero.video, course, defaults),
      showVideo: course.slug === defaults.slug || Boolean(course.introVideoUrl),
      microcopy: course.slug === defaults.slug ? content.hero.microcopy : [course.duration,course.deliveryLabel ?? ""].filter(Boolean),
      action: action ?? content.hero.action,
      title: course.title === defaults.title ? content.hero.title : [course.title],
      description: course.description === defaults.description ? content.hero.description : course.description,
    },
  };
}
