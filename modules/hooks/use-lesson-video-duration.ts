"use client";
import { useEffect, useState } from "react";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import { lessonProbeSource } from "@platform/helpers/media/lesson-probe-source";
import { probeMediaDuration } from "@platform/helpers/media/probe-media-duration";

export function useLessonVideoDuration(slug: string, initialUrl: string, initialSeconds: number | undefined, labels: { durationError: string; durationLoading: string }) {
  const [url, setUrl] = useState(initialUrl), [attempt, retry] = useState(0);
  const [result, setResult] = useState({ url: initialSeconds ? initialUrl : "", seconds: initialSeconds, error: "" });
  const pending = Boolean(url && result.url !== url), seconds = url && !pending ? result.seconds : undefined, error = result.url === url ? result.error : "";
  function change(value: string) { if (value === url) return; setUrl(value); }
  function changeSeconds(value: number | undefined) { setResult(prev => ({ ...prev, seconds: value, error: "" })); }
  function retryProbe() { setResult({ url: "", seconds: undefined, error: "" }); retry(value => value + 1); }
  useEffect(() => {
    if (!url || result.url === url) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      const source = lessonProbeSource(slug, url);
      const probe = source ? probeMediaDuration(source, controller.signal, labels.durationError, slug) : Promise.reject(new Error(labels.durationError));
      void probe.then(sec => { if (!controller.signal.aborted) setResult({ url, seconds: sec, error: "" }); })
        .catch(() => { if (!controller.signal.aborted) setResult({ url, seconds: undefined, error: labels.durationError }); });
    }, policy.metadataDelayMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [url, slug, result.url, attempt, labels.durationError]);
  return { url, change, seconds, changeSeconds, pending, error, retry: retryProbe };
}
