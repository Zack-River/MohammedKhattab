"use client";
import { useState } from "react";
import VideoPreview from "./video-preview";
import type { CourseEditorProps } from "@platform/types/course-editor";
import { adminCoursePolicy as policy } from "@platform/config/admin";
import FormField from "@platform/components/ui/form-field";
import CourseThumbnailField from "./course-thumbnail-field";
export default function CourseMediaFields({ course, labels, uploadLabels, uploadHint }: Pick<CourseEditorProps,"labels" | "uploadLabels"> & { course?: CourseEditorProps["course"]; uploadHint?: string }) {
  const [videoUrl, setVideoUrl] = useState(course?.introVideoUrl ?? "");
  return <>
    <CourseThumbnailField slug={course?.slug} uploadHint={uploadHint} initialUrl={course?.thumbnailUrl ?? ""} label={labels.thumbnail} maxLength={policy.urlMax} uploadLabels={uploadLabels} />
    <FormField label={labels.video} name="introVideoUrl" dir="ltr" value={videoUrl} onChange={event => setVideoUrl(event.target.value)} maxLength={policy.urlMax} hint={labels.mediaHint} />
    <VideoPreview labels={labels} url={videoUrl} slug={course?.slug} thumbnailUrl={course?.thumbnailUrl} />
  </>;
}
