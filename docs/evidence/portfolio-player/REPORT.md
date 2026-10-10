# Original-file playback verification

Latest hero update: 2026-10-09. Workshop build: `nccrmyu5M76rlAgIjD7w-`.
LMS remains `73dFbtK8NvjvW_flYW1ph`.

Latest workshop build, lint and TypeScript passed; full suite: 46 passed.
LMS type check passed; previous unchanged LMS regression suite: 47 passed.
Architecture guard: 248 files, zero violations; source snapshot: 311 files.

The hero displays the original YouTube thumbnail saved locally. Both hero and
six portrait reels use only a centered play/pause button. Playback uses supplied
MP4s, loads on activation, pauses the previous native video and restores the
thumbnail when finished. No timeline, volume, fullscreen or provider-link UI is
rendered. Full controls remain available as an explicit reusable player variant.

Tests cover actual files, four widths, centered controls, native-controls absence,
keyboard play/pause, failure/retry, thumbnail restoration/restart and byte ranges.
The hero geometry test checks the intrinsic 16:9 source and less than 1px viewport
height difference caused by the original shell border. The 2026-10-09 full run used
one worker after the WSL session reset; all 46 tests passed without browser crashes.

Current thumbnail/active-player screenshots and `live-hero-check.json` record one
play/pause button, zero controls bars, and no page errors at desktop/mobile widths.
Thumbnail provenance is in `creatorMedia.workshopIntroThumbnailSource`.

This is public local media testing before access APIs. No protection claim,
production deployment or npm player dependency is introduced. Original visual
and historical performance baselines remain unchanged.


## Configurable component verification (2026-10-09)

Current workshop build: `kozYYw7yZr0mIRhVzbLjC`. Workshop build/lint/types and
isolated fixture build passed; LMS lint/types passed. Full workshop: **47 passed**.
Guard: 252 files, zero violations; source snapshot: 317 files.

Both hero and reels now compose the public `MediaPlayer`. Its isolated browser
case verifies 320×180 numeric and 240×150 CSS-string dimensions, separate green/red
accents, unchanged accent during playback, source and thumbnail replacement, and
thumbnail restoration on completion. The final case uses actual byte-range serving.
See `custom-player-props.json`, its screenshot and the refreshed full test log.
Full controls remain optional; current site placements retain the minimal overlay.


## Click to pause and scroll release — 2026-10-09

Production build `Tsnml6L26MOjGrtIhFAlw`, workshop 3022. Full workshop suite:
49 passed (1.3m), recorded in `scroll-reset-tests.log`. Live hero/reel checks in
`scroll-reset-live.json` show zero buttons during playback and a released source
with paused=true / readyState=0 after scrolling out. Isolated reuse tests include
a real throttled HTTP response that is aborted before completion. Build, lint,
root/LMS types and fixture build passed; architecture guard has 253 files and no
violations. Source snapshot contains 318 files. Returning to the viewport remains
inactive until clicked; partial scrolling while visible does not reset playback.


## Exclusive playback — 2026-10-09

Workshop build `6fCMGht_0JFvRQhvRXapZ`, port 3022. Full suite: **52 passed (1.1m)**,
recorded in `exclusive-playback-tests.log`. Six isolated reuse checks include
playing/paused previous players, switching back and aborting a real unfinished HTTP
response when another player starts. Live adjacent-reel evidence in
`exclusive-playback-live.json` confirms the original thumbnail is restored, the old
source is cleared and the new reel plays without page errors. Root build/lint/types,
fixture build and LMS lint/types passed. Architecture: 254 files, zero violations;
reproduction snapshot: 319 files. No dependencies or access APIs added.
