import { adminCoursePolicy as policy } from "@platform/config/admin";
import { categories } from "@platform/config/catalog";
import { validMediaUrl } from "./validate-media-url";
export function validateCourseEdit(input: Record<string, unknown> | null) {
  if (!input || (input.revision !== undefined && (!Number.isSafeInteger(input.revision) || Number(input.revision) < 0)) || typeof input.title !== "string" || input.title.trim().length < policy.titleMin || input.title.length > policy.titleMax ||
    typeof input.description !== "string" || input.description.trim().length < policy.descriptionMin || input.description.length > policy.descriptionMax ||
    typeof input.amount !== "number" || !Number.isFinite(input.amount) || input.amount < 0 || input.amount > policy.amountMax ||
    (input.duration !== undefined && (typeof input.duration !== "string" || input.duration.length > policy.durationMax)) ||
    !categories.some(category => category.id !== "all" && category.id === input.category) ||
    !validMediaUrl(input.thumbnailUrl) || !validMediaUrl(input.introVideoUrl) || typeof input.published !== "boolean") return null;
  return { ...(input.revision !== undefined ? { revision: Number(input.revision) } : {}), title: input.title.trim(), description: input.description.trim(), amount: input.amount, category: input.category as Exclude<typeof categories[number]["id"], "all">,
    ...(typeof input.duration === "string" ? { duration: input.duration.trim() } : {}),
    thumbnailUrl: input.thumbnailUrl, introVideoUrl: input.introVideoUrl, published: input.published };
}
