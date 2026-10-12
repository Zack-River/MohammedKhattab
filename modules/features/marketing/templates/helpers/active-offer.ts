import type { PriceQuote } from "@platform/types/commerce";
export function activeFeaturedOffer(quote:PriceQuote,now:number=Date.now()) {
 if(quote.offerMinor<=0 || !quote.offerTitle || quote.endsAt && (!Number.isFinite(Date.parse(quote.endsAt)) || Date.parse(quote.endsAt)<=now)) return null;
 return {title:quote.offerTitle,endsAt:quote.endsAt,remaining:quote.endsAt ? Math.max(0,Math.ceil((Date.parse(quote.endsAt)-now)/1000)) : 0};
}
