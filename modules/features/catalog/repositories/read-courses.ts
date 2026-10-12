import "server-only";
import { createDatabaseClient } from "@platform/lib/supabase/server";
import { ApiError } from "@platform/lib/api/error";
import { applyCatalogPrices } from "@platform/features/commerce/repositories/catalog-prices";
import { publicCourse } from "../helpers/public-course";
export async function readCourses() {
  const client = await createDatabaseClient();
  const { data, error } = await client.from("courses").select("slug,metadata,amount").eq("published", true).order("position");
  if (error) throw new ApiError(503, "INTERNAL_ERROR");
  return applyCatalogPrices((data ?? []).map(row => publicCourse(row.metadata, row.slug, Number(row.amount))));
}
