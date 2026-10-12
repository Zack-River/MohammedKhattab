import { offerBaseAmount } from "@platform/features/commerce/helpers/offer-base-amount";
import Action from "@khatab/design/ui/action";
import Symbol from "@platform/components/ui/symbol";
import type { CourseDetailsProps } from "@platform/types/course-details";
import EnrollButton from "./enroll-button";
export default function CourseEnrollmentAction({ course, copy, labels, enrolled, nextLesson, supportHref }: Pick<CourseDetailsProps,"course" | "copy" | "labels" | "enrolled" | "nextLesson" | "supportHref">) {
  if (course.delivery === "live" && !nextLesson && (enrolled || offerBaseAmount(course.offer) === 0))
    return <Action kind="anchor" href={supportHref} className="btn-primary lms-full-button">{enrolled ? labels.workshopSupport : labels.workshopBooking}<Symbol name="arrow" /></Action>;
  return <EnrollButton copy={copy} slug={course.slug} firstLesson={nextLesson} enrolled={enrolled} paid={offerBaseAmount(course.offer) > 0} />;
}
