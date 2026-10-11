import { categories } from "@platform/config/catalog";
import type { Course } from "@platform/types/lms";
import type { CreateCourseInput } from "@platform/types/admin-courses";
const artworks = { editing: "timeline", motion: "motion", design: "design", business: "business" } as const;
export function createCourseMetadata(input: CreateCourseInput, defaults: { currency: string; action: string; liveLabel: string }): Course {
 return { slug: input.slug, title: input.title, description: input.description, category: input.category, categoryLabel: categories.find(category => category.id === input.category)!.label, delivery: input.delivery,
  ...(input.delivery === "live" ? { deliveryLabel: defaults.liveLabel } : {}), tool: "", level: "", duration: "", subtitle: "", outcomes: [], modules: [], artwork: artworks[input.category], offer: { amount: input.amount, currencyLabel: defaults.currency, caption: "", actionLabel: defaults.action } };
}
