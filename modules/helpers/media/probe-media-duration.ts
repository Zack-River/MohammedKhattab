import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import { probeYouTubeDuration } from "@khatab/design/helpers/media/youtube/probe-duration";
import { curriculumPolicy } from "@platform/config/curriculum";
import { probeVideoDuration } from "./probe-video-duration";
export async function probeMediaDuration(source: string, signal: AbortSignal, errorLabel: string) {
  if (!getYouTubeEmbedUrl(source)) return probeVideoDuration(source, signal, errorLabel);
  const seconds = await probeYouTubeDuration(source, signal, curriculumPolicy.metadataTimeoutMs);
  if (seconds > curriculumPolicy.maxDurationSeconds) throw new Error(errorLabel);
  return seconds;
}
