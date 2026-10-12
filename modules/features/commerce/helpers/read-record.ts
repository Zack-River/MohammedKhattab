import type { Tables } from "@platform/types/database";
import type { CommerceRecord } from "@platform/types/commerce";
import { emptyCommerceRecord } from "./empty-record";
export function readBundleRecord(row: Tables<"commerce_bundles">, courseSlugs: string[]): CommerceRecord {
 return {...emptyCommerceRecord(),key:row.slug,title:row.title,description:row.description,amountMinor:row.amount_minor,enabled:row.enabled,revision:row.revision,createdAt:row.created_at,updatedAt:row.updated_at,courseSlugs};
}
export function readDiscountRecord(row: Tables<"commerce_discounts">): CommerceRecord {
 return {...emptyCommerceRecord(),key:row.key,title:row.title,description:row.description,courseSlug:row.course_slug,bundleSlug:row.bundle_slug,discountType:row.discount_type as "percent" | "fixed",discountValue:row.discount_value,startsAt:row.starts_at,endsAt:row.ends_at,enabled:row.enabled,stackable:row.stackable,minimumMinor:row.minimum_minor,maximumUses:row.maximum_uses,perUserLimit:row.per_user_limit,revision:row.revision,createdAt:row.created_at,updatedAt:row.updated_at};
}
