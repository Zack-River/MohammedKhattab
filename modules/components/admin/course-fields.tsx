"use client";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import { useId } from "react";
import FormField from "@platform/components/ui/form-field";
import type { Course } from "@platform/types/lms";
export default function CourseFields({ course, published, labels, categories }: { course: Course; published: boolean; labels: Record<string,string>; categories: readonly { id: string; label: string }[] }) {
  const id = useId();
  return <>
    <FormField label={labels.title} name="title" defaultValue={course.title} required maxLength={policy.titleMax} minLength={policy.titleMin} />
    <label htmlFor={`${id}-description`}>{labels.descriptionLabel}</label><textarea id={`${id}-description`} name="description" defaultValue={course.description} required maxLength={policy.descriptionMax} rows={4} />
    <FormField label={labels.price} name="amount" type="number" min={0} max={policy.amountMax} step="0.01" defaultValue={course.offer.amount} required />
    <label htmlFor={`${id}-category`}>{labels.category}</label><select id={`${id}-category`} name="category" defaultValue={course.category}>{categories.map(category => <option key={category.id} value={category.id}>{category.label}</option>)}</select>
    <FormField label={labels.thumbnail} name="thumbnailUrl" dir="ltr" defaultValue={course.thumbnailUrl ?? ""} maxLength={policy.urlMax} />
    <FormField label={labels.video} name="introVideoUrl" dir="ltr" defaultValue={course.introVideoUrl ?? ""} maxLength={policy.urlMax} hint={labels.mediaHint} />
    <label className="lms-admin-checkbox"><input type="checkbox" name="published" defaultChecked={published} />{labels.published}</label>
  </>;
}
