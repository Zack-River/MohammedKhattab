"use client";
import { useState } from "react";
import { useCreateCourse } from "@platform/hooks/use-create-course";
import { courseAdministration } from "@platform/config/course-administration";
import FormField from "@platform/components/ui/form-field";
import Select from "@khatab/design/ui/select";
import type { AdminCoursesLabels } from "@platform/types/admin-courses";
import type { CourseEditorProps } from "@platform/types/course-editor";
import CourseFormLayout from "./course-form-layout";
import CourseFields from "./course-fields";
import CourseMediaFields from "./course-media-fields";
import SaveFeedback from "./save-feedback";
import WorkshopFeaturedField from "./workshop-featured-field";
type Props = Pick<CourseEditorProps,"categories" | "uploadLabels"> & { labels: AdminCoursesLabels; editorLabels: CourseEditorProps["labels"] };
export default function CourseCreateForm({ labels, editorLabels, categories, uploadLabels }: Props) {
  const command = useCreateCourse(labels.error);
  const [delivery, setDelivery] = useState<"recorded" | "live">("recorded");
  return <CourseFormLayout labels={editorLabels} pending={command.pending}
    onSubmit={event => { event.preventDefault(); void command.create(new FormData(event.currentTarget)); }}
    details={<><CourseFields labels={editorLabels} categories={categories} delivery={delivery} />
      <FormField label={labels.slug} name="slug" dir="ltr" required maxLength={courseAdministration.slugMaxLength} pattern="[a-z0-9]+(-[a-z0-9]+)*" hint={labels.slugHint} />
      <Select name="delivery" label={labels.delivery} value={delivery} onValueChange={value => setDelivery(value as "recorded" | "live")} options={[{value:"recorded",label:labels.recorded},{value:"live",label:labels.live}]} /></>}
    media={<CourseMediaFields labels={editorLabels} uploadLabels={uploadLabels} uploadHint={labels.uploadAfterCreate} />}
    actions={<>{delivery === "live" && <WorkshopFeaturedField labels={editorLabels} />}<p className="lms-field-hint">{labels.createHint}</p><SaveFeedback {...command} saved={false} labels={{save:labels.create,saving:labels.creating,saved:editorLabels.saved}} /></>} />;
}
