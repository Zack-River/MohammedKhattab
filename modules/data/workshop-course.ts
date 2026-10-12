import { courseOffers } from "./offers";
import { categories } from "@platform/config/catalog";
import { workshopCourseConfig } from "@/config/workshop-course";
import { creatorMedia } from "@/config/creator-media";
import { siteConfig } from "@/app/config/site";
import { roadmapDays } from "@/app/data/workshop/curriculum";
import type { Course } from "@platform/types/lms";
export const liveWorkshopCourse: Course = {
  slug: workshopCourseConfig.slug, title: siteConfig.title.split(" | ")[0],
  description: siteConfig.description, subtitle: siteConfig.promotionalDescription,
  category: "business", categoryLabel: categories.find(category => category.id === "business")!.label, tool: "Premiere Pro + After Effects",
  level: "مناسب للمبتدئين", duration: workshopCourseConfig.duration,
  delivery: "live", deliveryLabel: workshopCourseConfig.deliveryLabel, featured: true,
  thumbnailUrl: creatorMedia.workshopIntro.poster, introVideoUrl: creatorMedia.workshopIntro.url,
  artwork: "business", modules: [], outcomes: roadmapDays.filter(day => day.kind !== "pause").map(day => day.title),
  offer: { ...courseOffers["7days-freelance"], caption: "سعر مبدئي قابل للتعديل", actionLabel: siteConfig.enrollmentLabel },
};
