"use client";
import { useId, useState, type ChangeEvent } from "react";
import { useHydrated } from "@khatab/design/hooks/use-hydrated";
import { imageUploadPolicy } from "@platform/config/image-upload";
import { useAsyncCommand } from "@platform/hooks/use-async-command";
import { uploadImageFile } from "@platform/helpers/upload-image";
import type { ImageUploadLabels, ImageUploadTarget, UploadedImage } from "@platform/types/image-upload";
import FormFeedback from "@platform/components/account/form-feedback";
export default function ImageUpload({ target, labels, onUploaded }: { target: ImageUploadTarget; labels: ImageUploadLabels; onUploaded?: (image: UploadedImage) => void }) {
  const hydrated = useHydrated(), id = useId(), command = useAsyncCommand(labels.error), [saved, setSaved] = useState(false);
  async function change(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]; event.currentTarget.value = "";
    if (!file) return;
    setSaved(false);
    const image = await command.run(() => uploadImageFile(file, target, labels.error));
    if (image) { setSaved(true); onUploaded?.(image); }
  }
  return <div className="lms-image-upload" aria-busy={command.pending}>
    <span>{labels.title}</span><label className="lms-image-upload-trigger" htmlFor={id}>{command.pending ? labels.uploading : labels.choose}
      <input id={id} type="file" accept={imageUploadPolicy.accept} disabled={!hydrated || command.pending} onChange={change} aria-describedby={`${id}-hint`} />
    </label><small id={`${id}-hint`} className="lms-field-hint">{labels.hint}</small>
    <FormFeedback error={command.error} message={saved ? labels.saved : ""} />
  </div>;
}
