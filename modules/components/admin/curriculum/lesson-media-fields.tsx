"use client";
import VideoPreview from "../video-preview";
import FormField from "@platform/components/ui/form-field";
import { useLessonVideoDuration } from "@platform/hooks/use-lesson-video-duration";
import { adminCoursePolicy } from "@platform/config/admin";
import type { CurriculumLabels } from "@platform/types/curriculum";
import LessonDurationInputs from "./lesson-duration-inputs";

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
      <LessonDurationInputs
        seconds={seconds}
        onChange={changeSeconds}
        pending={pending}
        error={error}
        labels={labels}
        onRetry={retry}
      />
    </>
  );
}
