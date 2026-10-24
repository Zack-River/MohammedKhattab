"use client";
import VideoPreview from "../video-preview";
import FormField from "@platform/components/ui/form-field";
import { useLessonVideoDuration } from "@platform/hooks/use-lesson-video-duration";
import { adminCoursePolicy } from "@platform/config/admin";
import type { CurriculumLabels } from "@platform/types/curriculum";

export default function LessonMediaFields({ slug, initialUrl, initialSeconds, labels }: { slug: string; initialUrl: string; initialSeconds?: number; labels: CurriculumLabels }) {
  const { url, change, seconds, changeSeconds, pending, error, retry } = useLessonVideoDuration(slug, initialUrl, initialSeconds, labels);
  return (
    <>
      <FormField
        label={labels.video}
        name="videoUrl"
        dir="ltr"
        value={url}
        onChange={event => change(event.target.value)}
        maxLength={adminCoursePolicy.urlMax}
        hint={labels.mediaHint}
        required
      />
      <VideoPreview labels={labels} url={url} slug={slug} />
      <FormField
        label={labels.duration}
        name="durationSeconds"
        type="number"
        dir="ltr"
        value={seconds ?? ""}
        onChange={event => {
          const val = event.target.value.trim();
          changeSeconds(val ? Math.max(1, Math.round(Number(val))) : undefined);
        }}
        hint={pending ? labels.durationLoading : (!seconds && error) ? labels.durationError : labels.durationHint}
        aria-busy={pending}
        min={1}
        required
      />
      {error && !seconds && (
        <button type="button" className="lms-text-link" onClick={retry}>
          {labels.retryDuration}
        </button>
      )}
    </>
  );
}
