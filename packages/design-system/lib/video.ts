/** Validate a YouTube ID and normalize it to the privacy-enhanced iframe host. */
export function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return null;
    const hosts = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtube-nocookie.com",
      "www.youtube-nocookie.com",
    ];
    const id =
      url.hostname === "youtu.be"
        ? url.pathname.slice(1)
        : hosts.includes(url.hostname)
          ? url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1]
          : null;
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`;
  } catch {
    return null;
  }
}
