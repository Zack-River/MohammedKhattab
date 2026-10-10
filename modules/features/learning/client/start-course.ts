import { ensureEnrollment } from "./ensure-enrollment";
export async function startCourse({ slug, enrolled, firstLesson, enroll, lessonHref, navigation }: {
  slug: string; enrolled: boolean; firstLesson?: string;
  enroll: (slug: string) => Promise<unknown>;
  lessonHref: (slug: string, lesson: string) => string;
  navigation: { push: (href: string) => void; refresh: () => void };
}) {
  if (!firstLesson) return;
  await ensureEnrollment({ slug, enrolled, enroll });
  navigation.push(lessonHref(slug, firstLesson));
  if (!enrolled) navigation.refresh();
}
