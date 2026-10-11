"use client";
import { useState } from "react";
import FormField from "@platform/components/ui/form-field";
import ImageUpload from "@platform/components/ui/image-upload";
import type { ImageUploadLabels } from "@platform/types/image-upload";
export default function CourseThumbnailField({ slug, initialUrl, label, maxLength, uploadLabels, uploadHint }: { slug?: string; uploadHint?: string; initialUrl: string; label: string; maxLength: number; uploadLabels: ImageUploadLabels }) {
  const [url, setUrl] = useState(initialUrl);
  return <><FormField label={label} name="thumbnailUrl" dir="ltr" value={url} onChange={event => setUrl(event.target.value)} maxLength={maxLength} />
    {slug ? <ImageUpload target={{ kind: "course", courseSlug: slug }} labels={uploadLabels} onUploaded={image => setUrl(image.url)} /> : <small className="lms-field-hint">{uploadHint}</small>}
  </>;
}
