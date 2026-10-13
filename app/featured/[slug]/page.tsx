import type { ProductKind } from "@platform/types/commerce";
import { notFound } from "next/navigation";
import { readPublicTemplateSubject } from "@platform/features/marketing/templates/public-subject";
import FeaturedCourse from "@platform/features/marketing/templates/featured-course";
import { routes } from "@platform/config/navigation";
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ kind?: string | string[] }> };
async function subject({ params, searchParams }: Props) {
  const { slug } = await params, { kind } = await searchParams;
  if (kind !== undefined && kind !== "course" && kind !== "bundle") notFound();
  const productKind: ProductKind = kind === "bundle" ? "bundle" : "course";
  const course = await readPublicTemplateSubject(productKind, slug);
  if (!course?.featured) notFound();
  return { course, kind: productKind };
}
export async function generateMetadata(props: Props) {
  const { course, kind } = await subject(props);
  return { title: course.title, description: course.description, alternates: { canonical: routes.featured(course.slug, kind) } };
}
export default async function Page(props: Props) {
  return <FeaturedCourse {...await subject(props)} />;
}
