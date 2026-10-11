import { adminCoursePolicy as policy } from "@platform/config/admin";
import { courseAdministration } from "@platform/config/course-administration";
import { categories } from "@platform/config/catalog";
import type { CreateCourseInput } from "@platform/types/admin-courses";
export function validateCourseCreate(input: Record<string, unknown> | null): CreateCourseInput | null {
 if (!input || typeof input.slug !== "string" || input.slug === "new" || input.slug.length > courseAdministration.slugMaxLength || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) || typeof input.title !== "string" || input.title.trim().length < policy.titleMin || input.title.length > policy.titleMax || typeof input.description !== "string" || input.description.trim().length < policy.descriptionMin || input.description.length > policy.descriptionMax || typeof input.amount !== "number" || !Number.isFinite(input.amount) || input.amount < 0 || input.amount > policy.amountMax || !categories.some(category => category.id !== "all" && category.id === input.category) || !["live","recorded"].includes(String(input.delivery))) return null;
 return { slug: input.slug, title: input.title.trim(), description: input.description.trim(), amount: input.amount, category: input.category as CreateCourseInput["category"], delivery: input.delivery as CreateCourseInput["delivery"] };
}
