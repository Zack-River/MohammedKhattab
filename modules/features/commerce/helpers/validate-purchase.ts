import type { PurchaseInput } from "@platform/types/commerce";
export function validatePurchase(value: unknown): PurchaseInput | null {
 if (!value || typeof value !== "object" || Array.isArray(value)) return null;
 const input = value as Record<string,unknown>;
 if (Object.keys(input).some(key => !["courseSlug","bundleSlug","couponCode","expectedTotalMinor"].includes(key))) return null;
 if (Boolean(input.courseSlug) === Boolean(input.bundleSlug)) return null;
 const slug = input.courseSlug ?? input.bundleSlug;
 if (typeof slug !== "string" || slug.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
 if (input.couponCode !== undefined && (typeof input.couponCode !== "string" || !/^[A-Za-z0-9_-]{1,40}$/.test(input.couponCode))) return null;
 if(input.expectedTotalMinor !== undefined && (!Number.isInteger(input.expectedTotalMinor) || Number(input.expectedTotalMinor)<0 || Number(input.expectedTotalMinor)>100_000_000)) return null;
 return { ...(input.expectedTotalMinor !== undefined ? {expectedTotalMinor:Number(input.expectedTotalMinor)} : {}), ...(input.courseSlug ? {courseSlug:slug} : {bundleSlug:slug}), ...(input.couponCode ? {couponCode:String(input.couponCode).toUpperCase()} : {}) };
}
