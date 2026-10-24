import { apiResponse } from "@platform/lib/api/respond";
import { ApiError } from "@platform/lib/api/error";
import { requireAdmin } from "./identity";
import { adminCoursePolicy } from "@platform/config/admin";
import { getYouTubeEmbedUrl } from "@khatab/design/lib/video";

async function fetchYouTubeDuration(url: string): Promise<number | null> {
  if (!getYouTubeEmbedUrl(url)) return null;
  const parsed = new URL(url);
  const id = parsed.hostname === "youtu.be"
    ? parsed.pathname.slice(1)
    : parsed.searchParams.get("v") || parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1];
  if (!id || !/^[\w-]{11}$/.test(id)) return null;
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Accept-Language": "en-US,en;q=0.9" },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const html = await res.text(), match = html.match(/"lengthSeconds":"(\d+)"/) || html.match(/"approxDurationMs":"(\d+)"/);
    if (!match) return null;
    const sec = match[0].includes("approx") ? Math.ceil(Number(match[1]) / 1000) : Number(match[1]);
    return Number.isFinite(sec) && sec > 0 ? sec : null;
  } catch { return null; } finally { clearTimeout(timer); }
}

export function handleAdminMediaProbe(slug: string, request: Request) {
  return apiResponse(async () => {
    const { client } = await requireAdmin();
    const url = new URL(request.url).searchParams.get("url") ?? "";
    if (!url || url.length > adminCoursePolicy.urlMax) throw new ApiError(400, "INVALID_INPUT");
    const course = await client.from("courses").select("slug").eq("slug", slug).maybeSingle();
    if (course.error) throw new ApiError(503, "INTERNAL_ERROR");
    if (!course.data) throw new ApiError(404, "NOT_FOUND");
    const seconds = await fetchYouTubeDuration(url);
    return Response.json({ seconds: seconds ?? null });
  });
}
