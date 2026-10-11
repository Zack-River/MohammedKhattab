"use client";
import { useRouter } from "next/navigation";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { httpRequest } from "@platform/lib/http-request";
import { endpoints, routes } from "@platform/config/navigation";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import { courseAdministration } from "@platform/config/course-administration";
import FormField from "@platform/components/ui/form-field";
import CoursePriceField from "./course-price-field";
import Select from "@khatab/design/ui/select";
import type { AdminCoursesLabels } from "@platform/types/admin-courses";
export default function CourseCreateForm({ labels, categories }: { labels: AdminCoursesLabels; categories: readonly { id: string; label: string }[] }) {
 const router = useRouter(), command = useAsyncCommand(labels.error);
 return <form className="lms-profile-form" onSubmit={async event => {
  event.preventDefault(); const form = new FormData(event.currentTarget), body = { ...Object.fromEntries(form), amount: Number(form.get("amount")) };
  const slug = await command.run(() => httpRequest({ path: endpoints.adminCourses, body, failureLabel: labels.error, decode: value => {
   if (!value || typeof value !== "object" || !("slug" in value) || typeof value.slug !== "string") throw new Error(labels.error);
   return value.slug;
  } }));
  if (slug) router.push(routes.adminCourse(slug));
 }}>
  <fieldset disabled={command.pending}><FormField label={labels.name} name="title" required minLength={policy.titleMin} maxLength={policy.titleMax} />
   <FormField label={labels.slug} name="slug" dir="ltr" required maxLength={courseAdministration.slugMaxLength} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint={labels.slugHint} />
   <FormField label={labels.description} name="description" required minLength={policy.descriptionMin} maxLength={policy.descriptionMax} />
   <CoursePriceField labels={labels} />
   <Select name="category" label={labels.category} defaultValue={categories[0].id} options={categories.map(value => ({value:value.id,label:value.label}))} />
   <Select name="delivery" label={labels.delivery} defaultValue="recorded" options={["recorded","live"].map(value => ({value,label:labels[value as "live"]}))} /></fieldset>
  <button type="submit" className="btn-primary" disabled={command.pending}>{command.pending ? labels.creating : labels.create}</button>{command.error && <p className="lms-error" role="alert">{command.error}</p>}
 </form>;
}
