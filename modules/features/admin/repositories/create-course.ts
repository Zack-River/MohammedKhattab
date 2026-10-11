import "server-only";
import { requireAdmin } from "../identity";
import { createCourseMetadata } from "../helpers/create-course-metadata";
import { courseDraftDefaults } from "@platform/data/course-draft";
import { ApiError } from "@platform/lib/api/error";
import type { CreateCourseInput } from "@platform/types/admin-courses";
import type { Json } from "@platform/types/database";
export async function createCourse(input: CreateCourseInput) {
 const { client } = await requireAdmin(), metadata = createCourseMetadata(input, courseDraftDefaults);
 const { error } = await client.from("courses").insert({ slug: input.slug, metadata: JSON.parse(JSON.stringify(metadata)) as NonNullable<Json>, amount: input.amount, published: false });
 if (error) throw new ApiError(error.code === "23505" ? 409 : 503, error.code === "23505" ? "COURSE_SLUG_TAKEN" : "INTERNAL_ERROR");
 return { slug: input.slug };
}
