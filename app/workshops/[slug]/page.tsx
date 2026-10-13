import { notFound, permanentRedirect } from "next/navigation";
import { findCourse } from "@platform/features/catalog/service";
import { routes } from "@platform/config/navigation";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const course = await findCourse((await params).slug);
  if (!course || course.delivery !== "live") notFound();
  permanentRedirect(routes.course(course.slug));
}
