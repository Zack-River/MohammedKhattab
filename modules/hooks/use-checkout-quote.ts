"use client";
import { useState } from "react";
import { useAsyncCommand } from "./use-async-command";
import { paymentRequest } from "@platform/features/payments/client/request";
import { endpoints } from "@platform/config/navigation";
import type { PriceQuote,PurchaseInput } from "@platform/types/commerce";
export function useCheckoutQuote(input:PurchaseInput,initial:PriceQuote,error:string) {
 const command=useAsyncCommand(error),[quote,setQuote]=useState(initial),[coupon,setCoupon]=useState('');
 async function apply(remove=false) {
  const result=await command.run(()=>paymentRequest<PriceQuote>(endpoints.paymentQuote,{...input,...(!remove && coupon.trim() ? {couponCode:coupon.trim()} : {})}));
  if(result) {setQuote(result);if(remove) setCoupon('');}
 }
 return {...command,quote,coupon,setCoupon,apply};
}
