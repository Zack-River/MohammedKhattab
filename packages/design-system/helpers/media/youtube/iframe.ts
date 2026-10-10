export function createYouTubeIframe(url: string, title: string) {
  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = title;
  iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.tabIndex = -1;
  return iframe;
}
