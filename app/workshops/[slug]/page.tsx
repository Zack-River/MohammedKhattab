import { WorkshopPage } from "@/app/components/workshop";
import { workshopPage } from "@/app/data/workshop";
import { workshopMetadata } from "@/app/config/workshop-metadata";
import { findCourse } from "@platform/features/catalog/service";
import { routes } from "@platform/config/navigation";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { workshopCourseContent } from "@platform/features/marketing/models/workshop-course";
import { notFound } from "next/navigation";
type WorkshopParams = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: WorkshopParams) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course || course.delivery !== "live") notFound();
  return { ...workshopMetadata, alternates: { canonical: routes.workshopPage(slug) }, title: { absolute: course?.title ?? liveWorkshopCourse.title }, description: course?.description ?? workshopMetadata.description };
}
export default async function FreelanceWorkshopPage({ params }: WorkshopParams) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course || course.delivery !== "live") notFound();
  return <WorkshopPage content={workshopCourseContent(workshopPage,course,liveWorkshopCourse)} />;
}
