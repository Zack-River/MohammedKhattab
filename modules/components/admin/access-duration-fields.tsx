"use client";
import Select from "@khatab/design/ui/select";
import FormField from "@platform/components/ui/form-field";
import {accessDurations} from "@platform/config/enrollment";
import type {EnrollmentLabels} from "@platform/types/enrollment";
export default function AccessDurationFields({duration,onChange,labels}:{duration:string;onChange:(value:string)=>void;labels:EnrollmentLabels}) {
 return <><Select name="duration" label={labels.duration} value={duration} onValueChange={onChange} options={[...accessDurations]}/>
 {duration==="custom"&&<FormField name="days" label={labels.days} type="text" inputMode="numeric" pattern="[0-9]+" required maxLength={4}/>}</>;
}
