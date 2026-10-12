import test from "node:test";
import assert from "node:assert/strict";
import { validatePurchase } from "../../modules/features/commerce/helpers/validate-purchase";
import { validateCommerceRecord } from "../../modules/features/commerce/helpers/validate-record";
import { emptyCommerceRecord } from "../../modules/features/commerce/helpers/empty-record";
import { readCommerceForm } from "../../modules/features/commerce/helpers/read-form";
import { offerBaseAmount } from "../../modules/features/commerce/helpers/offer-base-amount";
import { paymentCourseSlugs } from "../../modules/features/payments/helpers/order-courses";
test("purchase boundary accepts exactly one product and optional canonical coupon",()=>{
 assert.deepEqual(validatePurchase({courseSlug:'motion-essentials',couponCode:'save_10',expectedTotalMinor:80000}),{courseSlug:'motion-essentials',couponCode:'SAVE_10',expectedTotalMinor:80000});
 for(const input of [{},{courseSlug:'a',bundleSlug:'b'},{courseSlug:'a',amount:1},{courseSlug:'a',expectedTotalMinor:-1},{courseSlug:'a',expectedTotalMinor:1.2},{courseSlug:'../a'},{bundleSlug:'a',couponCode:"x' OR 1=1"}]) assert.equal(validatePurchase(input),null);
});
test("bundle records require distinct existing-style slug identifiers and positive whole-unit price",()=>{
 const input={...emptyCommerceRecord(),key:'my-bundle',title:'باقة',amountMinor:10000,courseSlugs:['editing','motion']};
 assert.ok(validateCommerceRecord('bundles',input));
 for(const patch of [{courseSlugs:['editing']},{courseSlugs:['editing','editing']},{amountMinor:0},{amountMinor:1.5},{enabled:'true'}]) assert.equal(validateCommerceRecord('bundles',{...input,...patch}),null);
});
test("discounts validate target, percentage, limits and date ordering",()=>{
 const input={...emptyCommerceRecord(),key:'SAVE10',title:'خصم',discountValue:10};
 assert.ok(validateCommerceRecord('coupons',input));assert.equal(validateCommerceRecord('offers',{...input,key:'offer'}),null);
 for(const patch of [{discountValue:101},{discountValue:-1},{maximumUses:0},{perUserLimit:0},{courseSlug:'editing',bundleSlug:'bundle'},{startsAt:'2026-10-13T00:00:00Z',endsAt:'2026-10-12T00:00:00Z'}]) assert.equal(validateCommerceRecord('coupons',{...input,...patch}),null);
});
test("form decoder converts fixed monetary discounts to cents and optional limits to null",()=>{
 const form=new FormData();for(const [key,value] of Object.entries({key:'FIXED',title:'عرض',description:'',discountType:'fixed',discountValue:'100',minimum:'500',perUserLimit:'1',target:'bundle:my-bundle',enabled:'on'}))form.set(key,value);
 const input=readCommerceForm(form,emptyCommerceRecord());assert.equal(input.discountValue,10000);assert.equal(input.minimumMinor,50000);assert.equal(input.maximumUses,null);assert.equal(input.bundleSlug,'my-bundle');assert.equal(input.enabled,true);
});
test("receipts use purchased course snapshot and retain legacy single-course fallback",()=>{
 assert.deepEqual(paymentCourseSlugs({course_slug:null,pricing_snapshot:{courseSlugs:['editing','motion']}}),['editing','motion']);
 assert.deepEqual(paymentCourseSlugs({course_slug:'editing'}),['editing']);
 assert.deepEqual(paymentCourseSlugs({course_slug:null,pricing_snapshot:'invalid'}),[]);
});

test("zero-total sales retain original paid-product checkout semantics",()=>{
 assert.equal(offerBaseAmount({amount:0,baseAmount:500,currencyLabel:'',caption:'',actionLabel:''}),500);
 assert.equal(offerBaseAmount({amount:0,currencyLabel:'',caption:'',actionLabel:''}),0);
});
