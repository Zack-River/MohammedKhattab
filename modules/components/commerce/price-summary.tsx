import type { PriceQuote,CommerceLabels } from "@platform/types/commerce";
export default function PriceSummary({quote,labels}:{quote:PriceQuote;labels:CommerceLabels}) {
 const row=(label:string,minor:number,discount=false)=><div><dt>{label}</dt><dd><bdi className="numeral">{discount ? '−' : ''}{minor/100} {labels.currency}</bdi></dd></div>;
 return <dl className="lms-commerce-price-summary">{quote.offerMinor+quote.couponMinor>0 && row(labels.subtotal,quote.baseMinor)}{quote.offerMinor>0 && row(quote.offerTitle ?? labels.offerDiscount,quote.offerMinor,true)}{quote.couponMinor>0 && row(labels.couponDiscount,quote.couponMinor,true)}<div className="lms-payment-total"><dt>{labels.total}</dt><dd className="numeral">{quote.totalMinor===0 ? labels.free : `${quote.totalMinor/100} ${labels.currency}`}</dd></div></dl>;
}
