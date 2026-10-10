import { getYouTubeEmbedUrl } from "../../../lib/video";
export function getControlledYouTubeUrl(
  url: string,
  origin: string,
): string | null {
  const base = getYouTubeEmbedUrl(url);
  if (!base) return null;
  const source = new URL(base);
  for (const [key, value] of Object.entries({
    controls: "0",
    enablejsapi: "1",
    disablekb: "1",
    fs: "0",
    rel: "0",
    origin,
  }))
    source.searchParams.set(key, value);
  return source.href;
}
