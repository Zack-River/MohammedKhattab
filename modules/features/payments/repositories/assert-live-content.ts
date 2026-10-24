import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { ApiError } from "@platform/lib/api/error";
import { sampleLessonVideoId } from "@platform/config/catalog";
import { isSampleLessonVideo } from "../helpers/sample-content";
/** Check all purchased members before creating an order or contacting the live provider. */
export async function assertLivePurchaseContent(slugs: string[]) {
  const client = createAuthAdministrator();
  const [samples, courses] = await Promise.all([
    client.from("lessons").select("video_url").in("course_slug", slugs).like("video_url", `%${sampleLessonVideoId}%`),
    client.from("courses").select("slug,delivery:metadata->>delivery").in("slug", slugs),
  ]);
  if (samples.error || courses.error) throw new ApiError(503, "INTERNAL_ERROR");
  if (samples.data.some(lesson => isSampleLessonVideo(lesson.video_url))) throw new ApiError(409, "COURSE_CONTENT_NOT_READY");
  const recorded = courses.data.filter(course => course.delivery !== "live").map(course => course.slug);
  if (!recorded.length) return;
  const lessons = await client.from("lessons").select("course_slug,video_url").in("course_slug", recorded);
  if (lessons.error) throw new ApiError(503, "INTERNAL_ERROR");
  for (const slug of recorded) {
    const ready = lessons.data.some(lesson => lesson.course_slug === slug && Boolean(lesson.video_url));
    if (!ready) throw new ApiError(409, "COURSE_CONTENT_NOT_READY");
  }
}
