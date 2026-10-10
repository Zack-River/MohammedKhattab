"use client";
import { adminCoursePolicy } from "@platform/config/admin";
import { endpoints } from "@platform/config/navigation";
import FormField from "@platform/components/ui/form-field";
import { useAdminSave } from "@platform/hooks/use-admin-save";
import SaveFeedback from "./save-feedback";
export default function LessonVideoEditor({ slug, lesson, labels }: { slug: string; lesson: { id: string; title: string; video_url: string }; labels: Record<string,string> & { save: string; saving: string; saved: string } }) {
  const command = useAdminSave(endpoints.adminLesson(slug,lesson.id), labels.error);
  return <section className="lms-profile-card"><h3>{lesson.title}</h3><form className="lms-profile-form lms-admin-form" method="post" onSubmit={event => { event.preventDefault(); void command.save({ videoUrl: new FormData(event.currentTarget).get("videoUrl") }); }}>
    <FormField label={labels.lessonVideo} name="videoUrl" defaultValue={lesson.video_url} required dir="ltr" maxLength={adminCoursePolicy.urlMax} hint={labels.mediaHint} />
    <SaveFeedback {...command} labels={labels} />
  </form></section>;
}
