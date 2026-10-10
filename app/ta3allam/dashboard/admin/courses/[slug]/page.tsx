import Link from "next/link";
import { notFound } from "next/navigation";
import { readAdminCourses, readAdminLessons } from "@platform/features/admin/repositories/courses";
import { courseLessons } from "@platform/features/catalog/helpers";
import CourseEditor from "@platform/components/admin/course-editor";
import LessonVideoEditor from "@platform/components/admin/lesson-video-editor";
import PageHeading from "@platform/components/ui/page-heading";
import { adminCopy } from "@platform/data/admin";
import { categories } from "@platform/config/catalog";
import { routes } from "@platform/config/navigation";
export default async function EditCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const record = (await readAdminCourses(slug))[0];
  if (!record) notFound();
  const lessons = await readAdminLessons(slug), metadata = courseLessons(record.course);
  return <><PageHeading title={record.course.title} description={adminCopy.description}><Link href={routes.course(slug)} className="lms-text-link">{adminCopy.publicPage}</Link></PageHeading>
    <section className="lms-profile-card"><CourseEditor {...record} labels={adminCopy} categories={categories.filter(category => category.id !== "all")} /></section>
    {lessons.length > 0 && <><PageHeading title={adminCopy.lessons} />{lessons.map(lesson => <LessonVideoEditor key={lesson.id} slug={slug} lesson={{ ...lesson, title: metadata.find(item => item.id === lesson.id)?.title ?? lesson.id }} labels={adminCopy} />)}</>}
  </>;
}
