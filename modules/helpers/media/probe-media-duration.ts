import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";
import { probeYouTubeDuration } from "@khatab/design/helpers/media/youtube/probe-duration";
import { curriculumPolicy } from "@platform/config/curriculum";
import { endpoints } from "@platform/config/navigation";
import { probeVideoDuration } from "./probe-video-duration";

export async function probeMediaDuration(source: string, signal: AbortSignal, errorLabel: string, slug?: string) {
  if (!getYouTubeEmbedUrl(source)) return probeVideoDuration(source, signal, errorLabel);
  if (slug) {
    try {
      const response = await fetch(endpoints.adminMediaProbe(slug, source), { signal });
      if (response.ok) {
        const data = await response.json();
        if (typeof data?.seconds === "number" && data.seconds > 0) {
          if (data.seconds > curriculumPolicy.maxDurationSeconds) throw new Error(errorLabel);
          return data.seconds;
        }
      }
    } catch (e) {
      if (signal.aborted) throw e;
    }
  }
  const seconds = await probeYouTubeDuration(source, signal, curriculumPolicy.metadataTimeoutMs);
  if (seconds > curriculumPolicy.maxDurationSeconds) throw new Error(errorLabel);
  return seconds;
}
