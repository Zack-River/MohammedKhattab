import "server-only";
import { securityPolicy } from "@platform/config/security";
import { ApiError } from "@platform/lib/api/error";
function allowedDriveUrl(url: URL) {
  return url.protocol === "https:" && !url.username && !url.password && (!url.port || url.port === "443") &&
    (url.hostname === "drive.usercontent.google.com" || url.hostname.endsWith(".googleusercontent.com"));
}
/** Validate every redirect before fetching; the header deadline does not truncate video playback. */
export async function fetchDrive(url: URL, headers: HeadersInit, requestSignal: AbortSignal) {
  const controller = new AbortController();
  const signal = AbortSignal.any([requestSignal, controller.signal]);
  const timer = setTimeout(() => controller.abort(), securityPolicy.upstreamHeadersTimeoutMs);
  try {
    for (let hop = 0; hop <= securityPolicy.maxRedirects; hop++) {
      if (!allowedDriveUrl(url)) throw new ApiError(503, "MEDIA_UNAVAILABLE");
      const response = await fetch(url, { headers, signal, cache: "no-store", redirect: "manual" });
      if (![301, 302, 303, 307, 308].includes(response.status)) return response;
      const location = response.headers.get("location");
      void response.body?.cancel().catch(() => undefined);
      if (!location) break;
      url = new URL(location, url);
    }
    throw new ApiError(503, "MEDIA_UNAVAILABLE");
  } catch { throw new ApiError(503, "MEDIA_UNAVAILABLE"); }
  finally { clearTimeout(timer); }
}
