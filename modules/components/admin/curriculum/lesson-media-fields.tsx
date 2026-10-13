"use client";
import VideoPreview from "../video-preview";
import FormField from "@platform/components/ui/form-field";
import { useLessonVideoDuration } from "@platform/hooks/use-lesson-video-duration";
import { adminCoursePolicy } from "@platform/config/admin";
import type { CurriculumLabels } from "@platform/types/curriculum";
export default function LessonMediaFields({ slug, initialUrl, initialSeconds, labels }: { slug: string; initialUrl: string; initialSeconds?: number; labels: CurriculumLabels }) {
  const { url, change, seconds, pending, error, inputRef, retry } = useLessonVideoDuration(slug,initialUrl,initialSeconds,labels);
  return <>
    <FormField label={labels.video} name="videoUrl" ref={inputRef} dir="ltr" value={url} onChange={event => change(event.target.value)} maxLength={adminCoursePolicy.urlMax} hint={labels.mediaHint} error={error} required />
    <VideoPreview labels={labels} url={url} slug={slug} />
    <FormField label={labels.duration} name="durationSeconds" type="text" dir="ltr" readOnly value={seconds ?? ""} hint={pending ? labels.durationLoading : labels.durationHint} aria-busy={pending} />
    {error && <button type="button" className="lms-text-link" onClick={retry}>{labels.retryDuration}</button>}
  </>;
}
