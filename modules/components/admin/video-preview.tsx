"use client";
import MediaPlayer from "@khatab/design/ui/media-player";
import { adminPreviewVideoUrl } from "@platform/features/admin/helpers/preview-video-url";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import type { mediaPreviewCopy } from "@platform/data/media-preview";
type Labels = Pick<typeof mediaPreviewCopy, "previewTitle" | "previewPlay" | "previewHint" | "previewCreateFirst">;
export default function VideoPreview({ url, slug, thumbnailUrl, labels }: { url: string; slug?: string; thumbnailUrl?: string; labels: Labels }) {
  const source = adminPreviewVideoUrl(url, slug);
  if (!source) return !slug && driveFileId(url) ? <p className="lms-field-hint">{labels.previewCreateFirst}</p> : null;
  return <section aria-label={labels.previewTitle} className="lms-form-field">
    <span>{labels.previewTitle}</span>
    <MediaPlayer videoUrl={source} thumbnailUrl={thumbnailUrl ?? ""} title={labels.previewTitle} playLabel={labels.previewPlay} controlsVariant="full" />
    <small className="lms-field-hint">{labels.previewHint}</small>
  </section>;
}
