import { readCommerceForm } from "../../modules/features/commerce/helpers/read-form";
import { emptyCommerceRecord } from "../../modules/features/commerce/helpers/empty-record";
import test from "node:test";
import assert from "node:assert/strict";
import { activeFeaturedOffer } from "../../modules/features/marketing/templates/helpers/active-offer";
import { defaultWorkshopTemplate } from "../../modules/features/marketing/templates/default-template";
import { bundleTemplateCourse } from "../../modules/features/marketing/templates/helpers/bundle-course";
import { liveWorkshopCourse } from "../../modules/data/workshop-course";
import { isTemplateEndpoint } from "../../modules/config/workshop-template";
import type { PriceQuote } from "../../modules/types/commerce";
const now=Date.parse('2026-10-13T12:00:00Z');
const quote:PriceQuote={kind:'course',slug:'test',title:'Course',courseSlugs:['test'],baseMinor:100000,offerMinor:10000,couponMinor:0,totalMinor:90000,offerTitle:'Real sale',couponCode:null,endsAt:new Date(now+60000).toISOString()};
test('featured urgency uses the active sale name and fixed database deadline',()=>assert.deepEqual(activeFeaturedOffer(quote,now),{title:'Real sale',endsAt:quote.endsAt,remaining:60}));
test('missing, expired, malformed and coupon-only offers cannot produce a sale strip',()=>{
 for(const patch of [{offerMinor:0},{offerTitle:null},{endsAt:new Date(now).toISOString()},{endsAt:'invalid'},{offerMinor:0,couponMinor:10000}]) assert.equal(activeFeaturedOffer({...quote,...patch},now),null);
 assert.deepEqual(activeFeaturedOffer({...quote,endsAt:null},now),{title:'Real sale',endsAt:null,remaining:0});
});
test('bundle defaults aggregate included curriculum and link bundle checkout',()=>{
 const course=bundleTemplateCourse({slug:'bundle-test',title:'Bundle',description:'Two courses',featured:true,amountMinor:50000},[liveWorkshopCourse,liveWorkshopCourse]);
 const document=defaultWorkshopTemplate(course,'bundle');
 assert.equal(course.modules.length,2);assert.equal(course.title,'Bundle');
 for(const action of [document.content.hero.action,document.content.roadmap.action,document.content.finalCta.action]) assert.equal(action.href,'/checkout/bundle-test?kind=bundle');
 assert.equal(document.content.hero.showVideo,false);
 assert.equal(bundleTemplateCourse({slug:'empty-bundle',title:'Empty',description:'',amountMinor:100},[]).duration,'');
});
test('only registered course/bundle template endpoints get the expanded body limit',()=>{
 assert.equal(isTemplateEndpoint('/api/admin/commerce/bundles/bundle-test/template'),true);
 assert.equal(isTemplateEndpoint('/api/admin/courses/course-test/template'),true);
 for(const path of ['/api/admin/commerce/offers/offer/template','/api/admin/commerce/bundles/bundle-test','/api/payments/checkout','/api/admin/commerce/bundles/../template']) assert.equal(isTemplateEndpoint(path),false);
});

test('bundle featured checkbox decodes unchecked hidden value and checked state correctly',()=>{
 const form=new FormData();form.append('featured','false');
 assert.equal(readCommerceForm(form,emptyCommerceRecord()).featured,false);
 form.append('featured','on');assert.equal(readCommerceForm(form,emptyCommerceRecord()).featured,true);
});
