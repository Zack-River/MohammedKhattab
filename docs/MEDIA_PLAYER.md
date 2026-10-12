# Reusable MediaPlayer

Import from `@khatab/design/ui/media-player`. Load the shared theme and
`@khatab/design/styles/video-player.css` once in the consuming app's global styles.
The workshop already does this.

```tsx
import MediaPlayer from "@khatab/design/ui/media-player";

<MediaPlayer
  videoUrl="/assets/video/workshop-intro.mp4"
  thumbnailUrl="/assets/images/workshop-intro-poster.jpg"
  width="100%"
  height={360}
  color="#fc3522"
  title="Workshop introduction"
/>
```

| Prop | Behavior |
| --- | --- |
| `videoUrl` | Required playable file/stream URL or embeddable individual YouTube URL. |
| `thumbnailUrl` | Image URL; local and external images work without Next image-host configuration. An empty string can use a supplied themed placeholder child. |
| `width`, `height` | Numbers mean pixels; CSS strings such as `100%`, `24rem`, `auto` or `clamp(...)` are accepted. Width is constrained to its container for responsive use. |
| `aspectRatio` | Defaults to `16 / 9`; supplies automatic height when height is omitted. Use `9 / 16` for a freestanding portrait player. |
| `color` | Per-instance playback-button/timeline accent; falls back to the global primary theme. |
| `title`, `playLabel`, `labels` | Accessible player/button names and customizable localized feedback/control labels. Shared Arabic defaults are centralized in `lib/player-labels.ts`. |
| `controlsVariant` | `overlay` (default): centered play button while paused; click the video to pause during playback. `full`: optional timeline, volume and fullscreen controls. |
| `fullscreenOnPlay` | Defaults to false, including the workshop hero and reels. Opt-in requests fullscreen from the thumbnail click, preserves the intrinsic video orientation with `object-fit: contain`, and displays a localized exit button. Escape exits too. If browser policy rejects fullscreen, playback continues inline. |
| `returnToPosterOnEnd` | Defaults to true; finishing restores the thumbnail. |
| `resetOnScrollOut` | Defaults to true; leaving the viewport restores the poster, releases the video source and cancels loading. Set false to keep playback mounted offscreen. |
| `thumbnailLoading` | `lazy` by default; select `eager` for a hero image. |
| `children` | Optional poster-only overlay content, such as badges or duration. |
| `className`, `placeholderClassName`, `playButtonClassName` | Optional presentation hooks for existing reference variants. |

The player loads the video after a click, retains keyboard interaction, handles
errors/retry and resets the previous player when another is activated. Changing `videoUrl` resets
its instance to the thumbnail, including switching back to a previous URL. Style
props apply to both thumbnail and active playback and never overwrite global theme
values. Dynamic inline dimensions and a scoped accent CSS variable are intentional
configuration; default visual values remain canonical theme tokens.

Drive links must resolve through the existing product stream adapter. Individual YouTube links select the existing deferred custom YouTube backend automatically. Playlist-only URLs are not videos.
MediaPlayer does not make public files private or prevent a viewer from saving them.

HeroVideo and ReelCard compose this component. The isolated test page at
`lms/tests/fixtures/reuse/app/media-player/` checks numeric/CSS-string sizes, separate
colors, playback, source/thumbnail replacement and completion. It is not a route in
either production app.

During playback there is no pause overlay. Click the video to pause; the centered
play button appears while paused. Space/K remain available on the focused player.
A scroll reset occurs when the player leaves the viewport, including while loading,
buffering or paused. Scrolling back never starts a request; a fresh play click starts
from zero. Cleanup removes the source and calls native `load()` to abort retrieval
and release the media buffer. It cannot undo bytes already transferred.

Starting another player restores the previous thumbnail immediately, including if
the previous video is paused, loading or buffering. Its source is released through
the same native cleanup, aborting retrieval. A shared activation hook coordinates
deferred instances before the new source mounts; native play events also claim
playback when resuming. Switching back starts a fresh instance from zero.

Player views and paused play buttons fade in using the shared 500ms surface timing
and cubic-bezier curve. Reduced motion skips these fades. Source release remains
immediate. See [the shared motion system](MOTION_SYSTEM.md).

Fullscreen entry belongs to the stable outer player wrapper, so mounting the native backend does not lose the activation gesture. Completion/exclusive reset exits fullscreen. Safe-area-aware exit positioning reuses shared spacing, control-size, border and surface tokens.

The supported-browser fullscreen toggle sits at the top right, fades in on hover, and appears when the toggle itself has keyboard focus. It remains visible on touch screens and while fullscreen as the exit control. Playback starts inline unless `fullscreenOnPlay` is explicitly enabled.

Fullscreen/exit controls have transparent backgrounds in every state and no button border. Their white icons use a compact black drop shadow built from shared size and shadow-color tokens for stronger contrast; there is no red SVG outline.

## Course YouTube links

Course intro and lesson fields accept individual HTTPS YouTube watch, youtu.be, Shorts, mobile, live-video and embed links, alongside existing Drive and direct files. The shared normalizer resolves them to youtube-nocookie.com; lesson playback reuses the deferred YouTube backend and existing custom controls. A playlist-only URL does not identify a lesson. The creator must allow embedding; private/restricted videos can fail. The app does not download or rehost YouTube files.

Admin lesson duration is measured through the shared YouTube iframe API using a disposable non-playing metadata probe. It polls until duration is available, times out, and destroys the iframe/timers on completion, cancellation or error. Changing/closing the form aborts the probe without tearing down the SDK used by other players. The existing maximum lesson duration and form validation apply. No YouTube API key or new player dependency is required.
