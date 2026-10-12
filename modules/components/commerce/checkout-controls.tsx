"use client";
import { useCheckoutQuote } from "@platform/hooks/use-checkout-quote";
import FormField from "@platform/components/ui/form-field";
import CheckoutButton from "@platform/components/payments/checkout-button";
import PriceSummary from "./price-summary";
import type { PriceQuote,PurchaseInput,CommerceLabels } from "@platform/types/commerce";
export default function CheckoutControls({input,initial,labels,paymentLabels}:{input:PurchaseInput;initial:PriceQuote;labels:CommerceLabels;paymentLabels:{pay:string;pending:string;error:string;secure:string}}) {
 const state=useCheckoutQuote(input,initial,paymentLabels.error);
 return <><form className="lms-profile-form lms-commerce-coupon" onSubmit={event=>{event.preventDefault();void state.apply();}}><FormField label={labels.coupon} value={state.coupon} onChange={event=>state.setCoupon(event.target.value)} maxLength={40} pattern="[A-Za-z0-9_-]+" dir="ltr" disabled={state.pending} />
 <button className="lms-secondary-button" disabled={state.pending || !state.coupon.trim()}>{labels.applyCoupon}</button>{state.quote.couponCode && <button type="button" className="lms-course-text-link" disabled={state.pending} onClick={()=>void state.apply(true)}>{labels.removeCoupon}: <bdi>{state.quote.couponCode}</bdi></button>}</form>
 {state.error && <p className="lms-error" role="alert">{state.error}</p>}<PriceSummary quote={state.quote} labels={labels} />
 <CheckoutButton key={`${state.quote.couponCode}:${state.quote.totalMinor}`} input={{...input,...(state.quote.couponCode ? {couponCode:state.quote.couponCode} : {})}} totalMinor={state.quote.totalMinor} disabled={state.pending} labels={{...paymentLabels,pay:state.quote.totalMinor===0 ? labels.checkout : paymentLabels.pay}} /><p className="lms-payment-caption">{state.quote.totalMinor===0 ? labels.freeCheckoutHint : paymentLabels.secure}</p></>;
}
