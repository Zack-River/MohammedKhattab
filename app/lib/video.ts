const ALLOWED_VIDEO_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "iframe.mediadelivery.net",
]);

export function getSafeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const isAllowedHost = [...ALLOWED_VIDEO_HOSTS].some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );

    if (url.protocol !== "https:" || !isAllowedHost) return null;

    url.searchParams.set("autoplay", "1");
    return url.toString();
  } catch {
    return null;
  }
}

/** Normalize supported YouTube links to one validated privacy-enhanced embed. */
export function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:") return null;
    const hosts = [
      "youtube.com",
      "www.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    else if (hosts.includes(url.hostname)) {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else
        id =
          url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})\/?$/)?.[1] ??
          null;
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
  } catch {
    return null;
  }
}
