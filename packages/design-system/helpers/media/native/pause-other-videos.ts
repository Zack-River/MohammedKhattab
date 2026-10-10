/** Playback coordination can be limited to a panel, document or shadow root. */
export function pauseOtherVideos(video: HTMLVideoElement, scope: ParentNode = video.ownerDocument) {
  scope.querySelectorAll("video").forEach((other) => {
    if (other !== video) other.pause();
  });
}
