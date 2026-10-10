export function releaseVideoSource(video: HTMLVideoElement) {
  video.pause();
  video.removeAttribute("src");
  // Loading without a source empties the buffer and aborts outstanding requests.
  video.load();
}
