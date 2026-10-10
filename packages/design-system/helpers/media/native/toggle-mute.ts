export function toggleNativeMute(video: HTMLVideoElement | null) {
  if (video) video.muted = !video.muted;
}
