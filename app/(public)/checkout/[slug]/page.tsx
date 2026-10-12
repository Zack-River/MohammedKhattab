import CommerceCheckoutPage from "@platform/features/commerce/checkout-page";
import { paymentCopy } from "@platform/data/payment-copy";
export const metadata={title:paymentCopy.title,robots:{index:false,follow:false}};
export default async function Page({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<{kind?:string}>}) {
 return <CommerceCheckoutPage slug={(await params).slug} bundle={(await searchParams).kind==='bundle'} />;
}
