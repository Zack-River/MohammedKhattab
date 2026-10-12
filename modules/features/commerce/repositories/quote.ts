import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
import type { PurchaseInput, PriceQuote } from "@platform/types/commerce";
export async function quotePurchase(input: PurchaseInput, userId?: string): Promise<PriceQuote> {
 const {data,error} = await createAuthAdministrator().rpc("quote_commerce",{p_kind:input.bundleSlug ? "bundle" : "course",p_slug:input.bundleSlug ?? input.courseSlug!,p_coupon:input.couponCode,p_user:userId});
 if (error) commerceDatabaseError(error);
 const quote = data as unknown as PriceQuote;
 return {kind:quote.kind,slug:quote.slug,title:quote.title,courseSlugs:quote.courseSlugs,baseMinor:quote.baseMinor,offerMinor:quote.offerMinor,couponMinor:quote.couponMinor,totalMinor:quote.totalMinor,offerTitle:quote.offerTitle,couponCode:quote.couponCode,endsAt:quote.endsAt};
}
