"use client";
import { useState } from "react";
import Select from "@khatab/design/ui/select";
import FormField from "@platform/components/ui/form-field";
import DateRangeFields from "./date-range-fields";
import type { CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function DiscountFields({record,labels,targets,coupon}:{record:CommerceRecord;labels:CommerceLabels;targets:readonly {value:string;label:string}[];coupon:boolean}) {
 const [type,setType]=useState(record.discountType);
 return <><Select name="target" label={`${labels.course} / ${labels.bundle}`} required={!coupon} defaultValue={record.courseSlug ? `course:${record.courseSlug}` : record.bundleSlug ? `bundle:${record.bundleSlug}` : ''} options={[{value:'',label:labels.all,disabled:!coupon},...targets]} />
 <p className="lms-field-hint">{labels.targetHint}</p>
 <div className="lms-commerce-fields"><Select name="discountType" label={labels.discountType} value={type} onValueChange={value=>setType(value as typeof type)} options={[{value:'percent',label:labels.percent},{value:'fixed',label:labels.fixed}]} />
 <FormField name="discountValue" label={labels.discountValue} key={type} defaultValue={type===record.discountType ? record.discountValue/(type==='fixed' ? 100 : 1) : ''} inputMode="numeric" pattern="[0-9]+" required /></div>
 <DateRangeFields record={record} labels={labels} /></>;
}
