import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
import type { BundleProduct } from "@platform/types/commerce";
export async function publicBundles(): Promise<BundleProduct[]> {
 const {data,error}=await createAuthAdministrator().rpc("commerce_bundle_catalog");
 if(error) commerceDatabaseError(error);
 return (data as unknown as BundleProduct[]).map(bundle=>({...bundle,courseSlugs:bundle.quote.courseSlugs}));
}
export async function findBundle(slug:string) { return (await publicBundles()).find(bundle=>bundle.slug===slug); }
