import { curriculumPolicy as policy } from "@platform/config/curriculum";
export function probeVideoDuration(source: string, signal: AbortSignal, errorLabel: string): Promise<number> {
  return new Promise((resolve,reject) => {
    const video = document.createElement("video");
    let settled = false;
    const finish = (seconds?: number) => {
      if (settled) return;
      settled = true; clearTimeout(timeout);
      signal.removeEventListener("abort",abort); video.onloadedmetadata = null; video.onerror = null;
      video.removeAttribute("src"); video.load();
      if (seconds) resolve(seconds); else reject(new Error(errorLabel));
    };
    const abort = () => finish();
    const timeout = setTimeout(abort,policy.metadataTimeoutMs);
    video.onloadedmetadata = () => {
      const seconds = Math.ceil(video.duration);
      finish(Number.isFinite(seconds) && seconds > 0 && seconds <= policy.maxDurationSeconds ? seconds : undefined);
    };
    video.onerror = abort; signal.addEventListener("abort",abort,{once:true});
    if (signal.aborted) { abort(); return; }
    video.preload = "metadata"; video.src = source; video.load();
  });
}
