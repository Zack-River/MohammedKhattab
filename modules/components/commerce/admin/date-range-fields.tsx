"use client";
import FormField from "@platform/components/ui/form-field";
import { useHydrated } from "@khatab/design/hooks/use-hydrated";
import { localDateInput } from "@platform/features/commerce/helpers/read-form";
import type { CommerceRecord,CommerceLabels } from "@platform/types/commerce";
export default function DateRangeFields({record,labels}:{record:Pick<CommerceRecord,'startsAt' | 'endsAt'>;labels:Pick<CommerceLabels,'startsAt' | 'endsAt' | 'datesHint'>}) {
 const hydrated=useHydrated(),value=(date:string | null)=>hydrated ? localDateInput(date) : date?.slice(0,16) ?? '';
 return <><div key={String(hydrated)} className="lms-commerce-fields"><FormField name="startsAt" type="datetime-local" label={labels.startsAt} defaultValue={value(record.startsAt)} /><FormField name="endsAt" type="datetime-local" label={labels.endsAt} defaultValue={value(record.endsAt)} /></div><p className="lms-field-hint">{labels.datesHint}</p></>;
}
