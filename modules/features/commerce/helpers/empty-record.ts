import type { CommerceRecord } from "@platform/types/commerce";
export function emptyCommerceRecord(): CommerceRecord {
 return {key:"",title:"",description:"",amountMinor:0,courseSlugs:[],courseSlug:null,bundleSlug:null,discountType:"percent",discountValue:10,startsAt:null,endsAt:null,enabled:false,stackable:false,minimumMinor:0,maximumUses:null,perUserLimit:1,revision:0,createdAt:"",updatedAt:""};
}
