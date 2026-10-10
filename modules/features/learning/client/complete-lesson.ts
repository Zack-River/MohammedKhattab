import { ensureEnrollment } from "./ensure-enrollment";
export async function setLessonCompletion({ slug, enrolled, lessonId, completed, enroll, progress, refresh }: {
  slug: string; enrolled: boolean; lessonId: string; completed: boolean;
  enroll: (slug: string) => Promise<unknown>;
  progress: (input: { courseSlug: string; lessonId: string; completed: boolean }) => Promise<unknown>;
  refresh: () => void;
}) {
  await ensureEnrollment({ slug, enrolled, enroll });
  await progress({ courseSlug: slug, lessonId, completed });
  refresh();
}
