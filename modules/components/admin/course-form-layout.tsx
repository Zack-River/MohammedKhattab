import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { CourseEditorLabels } from "@platform/types/course-editor";
type Props = Omit<ComponentPropsWithoutRef<"form">,"className"> & {
  labels: Pick<CourseEditorLabels,"detailsHeading" | "mediaHeading" | "publicationHeading">;
  details: ReactNode; media: ReactNode; actions: ReactNode; pending?: boolean;
};
export default function CourseFormLayout({ labels, details, media, actions, pending, children, ...form }: Props) {
  return <form {...form} className="lms-profile-form lms-admin-form lms-course-editor-layout">
    {children}
    <section className="lms-profile-card lms-course-details" data-reveal><h2>{labels.detailsHeading}</h2><fieldset disabled={pending}>{details}</fieldset></section>
    <section className="lms-profile-card" data-reveal><h2>{labels.mediaHeading}</h2><fieldset disabled={pending}>{media}</fieldset></section>
    <section className="lms-profile-card" data-reveal><h2>{labels.publicationHeading}</h2>{actions}</section>
  </form>;
}
