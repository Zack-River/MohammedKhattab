export type CommerceKind = "bundles" | "offers" | "coupons";
export type ProductKind = "course" | "bundle";
export interface PurchaseInput { courseSlug?: string; bundleSlug?: string; couponCode?: string; expectedTotalMinor?: number; }
export interface PriceQuote {
 kind: ProductKind; slug: string; title: string; courseSlugs: string[];
 baseMinor: number; offerMinor: number; couponMinor: number; totalMinor: number;
 offerTitle: string | null; couponCode: string | null; endsAt: string | null;
}
export interface CommerceRecord {
 key: string; title: string; description: string; amountMinor: number; featured?: boolean;
 courseSlugs: string[]; courseSlug: string | null; bundleSlug: string | null;
 discountType: "percent" | "fixed"; discountValue: number;
 startsAt: string | null; endsAt: string | null; enabled: boolean;
 stackable: boolean; minimumMinor: number; maximumUses: number | null;
 perUserLimit: number; revision: number; createdAt: string; updatedAt: string;
}
export type CommerceInput = Omit<CommerceRecord,"createdAt" | "updatedAt">;
export interface CommerceList { records: CommerceRecord[]; total: number; page: number; }
export interface BundleProduct { featured?: boolean; slug: string; title: string; description: string; courseSlugs: string[]; quote: PriceQuote; }
export interface CommerceLabels {
 featuredLayout:string;featuredLayoutHint:string;
 title: string; bundles: string; offers: string; coupons: string; create: string; edit: string; remove: string;
 name: string; key: string; description: string; amount: string; courses: string; course: string; bundle: string;
 discountType: string; percent: string; fixed: string; discountValue: string; startsAt: string; endsAt: string;
 enabled: string; stackable: string; minimum: string; maximumUses: string; perUserLimit: string; unlimited: string;
 search: string; status: string; all: string; active: string; inactive: string; apply: string; clear: string;
 save: string; saving: string; saved: string; error: string; empty: string; previous: string; next: string;
 deleteConfirm: string; currency: string; revision: string; targetHint: string; datesHint: string; bundleHint: string;
 coupon: string; applyCoupon: string; removeCoupon: string; subtotal: string; offerDiscount: string; couponDiscount: string;
 total: string; freeCheckoutHint: string; buyBundle: string; bundlesHeading: string; includes: string; free: string; checkout: string;
}
