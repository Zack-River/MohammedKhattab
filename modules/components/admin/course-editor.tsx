"use client";
import type { CourseEditorProps } from "@platform/types/course-editor";
import { endpoints } from "@platform/config/navigation";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import { readCourseEdit } from "@platform/features/admin/helpers/read-course-edit";
import CourseMediaFields from "./course-media-fields";
import { Checkbox } from "@khatab/design/ui/choice-controls";
import CourseFields from "./course-fields";
import SaveFeedback from "./save-feedback";
export default function CourseEditor({ course, published, revision, labels, categories, uploadLabels }: CourseEditorProps) {
  const command = useAdminSave(endpoints.adminCourse(course.slug), labels.error);
  return <form className="lms-profile-form lms-admin-form lms-course-editor-layout" method="post" onSubmit={event => { event.preventDefault(); void command.save(readCourseEdit(new FormData(event.currentTarget))); }}>
    <input type="hidden" name="revision" value={revision} />
    <section className="lms-profile-card lms-course-details" data-reveal><h2>{labels.detailsHeading}</h2><CourseFields course={course} labels={labels} categories={categories} /></section>
    <section className="lms-profile-card" data-reveal><h2>{labels.mediaHeading}</h2><CourseMediaFields course={course} labels={labels} uploadLabels={uploadLabels} /></section>
    <section className="lms-profile-card" data-reveal><h2>{labels.publicationHeading}</h2><Checkbox label={labels.published} name="published" defaultChecked={published} /><SaveFeedback {...command} labels={labels} /></section>
  </form>;
}
