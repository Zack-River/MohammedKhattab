import { commercePolicy } from "@platform/config/commerce";
import type { CommerceInput, CommerceKind } from "@platform/types/commerce";
const integer = (value: unknown, min: number, max: number) => Number.isInteger(value) && Number(value) >= min && Number(value) <= max;
const slug = (value: unknown) => typeof value === "string" && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const date = (value: unknown) => value === null || typeof value === "string" && Number.isFinite(Date.parse(value));
export function validateCommerceRecord(kind: CommerceKind, value: unknown): CommerceInput | null {
 if (!value || typeof value !== "object" || Array.isArray(value)) return null;
 const v = value as CommerceInput;
 if (typeof v.key !== "string" || !(kind === "coupons" ? /^[A-Z0-9_-]{1,40}$/.test(v.key) : slug(v.key))) return null;
 if (typeof v.title !== "string" || !v.title.trim() || v.title.length > commercePolicy.maxTitle || typeof v.description !== "string" || v.description.length > commercePolicy.maxDescription) return null;
 if (!integer(v.revision,0,2_000_000_000) || typeof v.enabled !== "boolean" || typeof v.stackable !== "boolean") return null;
 if (!date(v.startsAt) || !date(v.endsAt) || v.startsAt && v.endsAt && Date.parse(v.startsAt) >= Date.parse(v.endsAt)) return null;
 if (v.courseSlug !== null && !slug(v.courseSlug) || v.bundleSlug !== null && !slug(v.bundleSlug) || v.courseSlug && v.bundleSlug) return null;
 if (!Array.isArray(v.courseSlugs) || v.courseSlugs.length > commercePolicy.maxCourses || !v.courseSlugs.every(slug) || new Set(v.courseSlugs).size !== v.courseSlugs.length) return null;
 if (!integer(v.amountMinor,0,commercePolicy.maximumMinor) || !integer(v.minimumMinor,0,commercePolicy.maximumMinor)) return null;
 if (kind === "bundles" && (v.courseSlugs.length < 2 || v.amountMinor < 100)) return null;
 if (kind === "offers" && !v.courseSlug && !v.bundleSlug) return null;
 if (!["percent","fixed"].includes(v.discountType) || !integer(v.discountValue,1,v.discountType === "percent" ? 100 : commercePolicy.maximumMinor)) return null;
 if (v.maximumUses !== null && !integer(v.maximumUses,1,1_000_000) || !integer(v.perUserLimit,1,1_000_000)) return null;
 return {key:v.key,title:v.title.trim(),description:v.description.trim(),amountMinor:v.amountMinor,courseSlugs:v.courseSlugs,courseSlug:v.courseSlug,bundleSlug:v.bundleSlug,discountType:v.discountType,discountValue:v.discountValue,startsAt:v.startsAt,endsAt:v.endsAt,enabled:v.enabled,stackable:v.stackable,minimumMinor:v.minimumMinor,maximumUses:v.maximumUses,perUserLimit:v.perUserLimit,revision:v.revision};
}
