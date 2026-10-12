import type { CommerceInput,CommerceRecord } from "@platform/types/commerce";
const minor=(value:FormDataEntryValue | null)=> /^\d+$/.test(String(value ?? '')) ? Number(value)*100 : -1;
const nullable=(value:FormDataEntryValue | null)=>value ? String(value) : null;
const date=(value:FormDataEntryValue | null)=>value ? new Date(String(value)).toISOString() : null;
export function readCommerceForm(form:FormData,record:CommerceRecord): CommerceInput {
 const type=String(form.get('discountType') ?? record.discountType) as 'percent' | 'fixed';
 const target=String(form.get('target') ?? '').split(':');
 return {...record,key:String(form.get('key') ?? record.key).trim(),title:String(form.get('title') ?? '').trim(),description:String(form.get('description') ?? ''),amountMinor:form.has('amount') ? minor(form.get('amount')) : record.amountMinor,
  courseSlugs:form.getAll('courseSlugs').map(String),courseSlug:target[0]==='course' ? target[1] : null,bundleSlug:target[0]==='bundle' ? target[1] : null,
  discountType:type,discountValue:form.has('discountValue') ? type==='fixed' ? minor(form.get('discountValue')) : Number(form.get('discountValue')) : record.discountValue,
  startsAt:date(form.get('startsAt')),endsAt:date(form.get('endsAt')),enabled:form.has('enabled'),featured:form.getAll('featured').some(value=>value==='on' || value==='true'),stackable:form.has('stackable'),minimumMinor:form.has('minimum') ? minor(form.get('minimum')) : 0,
  maximumUses:nullable(form.get('maximumUses')) ? Number(form.get('maximumUses')) : null,perUserLimit:Number(form.get('perUserLimit') ?? 1)};
}
export function localDateInput(value:string | null) {
 if(!value) return '';
 const date=new Date(value);return new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
}
