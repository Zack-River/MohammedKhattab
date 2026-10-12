import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
import type { Course } from "@platform/types/lms";
export async function applyCatalogPrices(courses: Course[]) {
 const {data,error} = await createAuthAdministrator().rpc("catalog_offer_prices");
 if (error) commerceDatabaseError(error);
 const prices = data as Record<string,{baseMinor:number;totalMinor:number;title:string;endsAt:string | null}>;
 return courses.map(course => {
  const price=prices[course.slug];
  return !price ? course : {...course,offer:{...course.offer,amount:price.totalMinor/100,baseAmount:price.baseMinor/100,saleTitle:price.title,saleEndsAt:price.endsAt,caption:price.title}};
 });
}
