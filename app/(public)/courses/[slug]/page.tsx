import { notFound, redirect } from "next/navigation";
import { findCourse } from "@platform/features/catalog";
import { routes } from "@platform/config/navigation";
import CourseDetailsPage from "@platform/features/catalog/course-details-page";
type CourseParams = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: CourseParams) {
  const { slug } = await params, course = await findCourse(slug);
  if (!course) notFound();
  return { title: course.title, description: course.description, alternates: { canonical: routes.course(course.slug,course.delivery) } };
}
export default async function CoursePage({ params }: CourseParams) {
  const { slug } = await params, course = await findCourse(slug);
  if (!course) notFound();
  if (course.delivery === "live") redirect(routes.workshopPage(slug));
  return <CourseDetailsPage course={course} />;
}
