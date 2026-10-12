import FeaturedWorkshop from "@platform/features/marketing/templates/featured-workshop";
import { workshopMetadata } from "@/app/config/workshop-metadata";
import { findCourse } from "@platform/features/catalog/service";
import { routes } from "@platform/config/navigation";
import { liveWorkshopCourse } from "@platform/data/workshop-course";
import { isFeaturedWorkshop } from "@platform/features/catalog/helpers/is-featured-workshop";
import CourseDetailsPage from "@platform/features/catalog/course-details-page";
import PublicSiteShell from "@platform/features/marketing/public-site-shell";
import { notFound } from "next/navigation";
type WorkshopParams = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: WorkshopParams) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course || course.delivery !== "live") notFound();
  if (!isFeaturedWorkshop(course)) return { title: course.title, description: course.description, alternates: { canonical: routes.workshopPage(course.slug) } };
  return { ...workshopMetadata, alternates: { canonical: routes.workshopPage(slug) }, title: { absolute: course?.title ?? liveWorkshopCourse.title }, description: course?.description ?? workshopMetadata.description };
}
export default async function FreelanceWorkshopPage({ params }: WorkshopParams) {
  const { slug } = await params;
  const course = await findCourse(slug);
  if (!course || course.delivery !== "live") notFound();
  if (!isFeaturedWorkshop(course)) return <PublicSiteShell><CourseDetailsPage course={course} /></PublicSiteShell>;
  return <FeaturedWorkshop course={course} />;
}
