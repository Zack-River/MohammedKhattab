import { WorkshopPage } from "@/app/components/workshop";
import { workshopPage } from "@/app/data/workshop";
import { workshopMetadata } from "@/app/config/workshop-metadata";
import { findCourse } from "@platform/features/catalog/service";
import { workshopCourseConfig } from "@/config/workshop-course";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { workshopCourseContent } from "@platform/features/marketing/models/workshop-course";
import { notFound } from "next/navigation";
export async function generateMetadata() {
  const course = await findCourse(workshopCourseConfig.slug);
  return { ...workshopMetadata, title: { absolute: course?.title ?? liveWorkshopCourse.title }, description: course?.description ?? workshopMetadata.description };
}
export default async function FreelanceWorkshopPage() {
  const course = await findCourse(workshopCourseConfig.slug);
  if (!course) notFound();
  return <WorkshopPage content={workshopCourseContent(workshopPage,course,liveWorkshopCourse)} />;
}
