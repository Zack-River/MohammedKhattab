# Creator portfolio playback test

Six creator-supplied videos from the folder recorded in `config/portfolio.ts`.
`config/portfolio-media.json` records source durations/dimensions and source/web sizes.
Display names describe visible footage; original filenames and Drive IDs are preserved.

Web copies use H.264, yuv420p, AAC 128 kbps, CRF 25, fast preset, no upscaling,
maximum dimension 1280, and `+faststart` for progressive playback. All six are portrait.
Thumbnails are extracted at one second from each web copy.
Originals are unchanged in Drive; temporary downloaded originals are outside the repo.

These files are public preview assets. No authentication, signed URLs or API restrictions
are implemented in this phase. No download button does not imply download prevention.
No player SDK or new npm dependency is required for native-file playback.

To recreate a web copy using FFmpeg:

```sh
ffmpeg -i ORIGINAL.mp4 -vf 'scale=w=min(1280\,iw):h=min(1280\,ih):force_original_aspect_ratio=decrease:force_divisible_by=2' -c:v libx264 -preset fast -crf 25 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart WEB.mp4
ffmpeg -ss 1 -i WEB.mp4 -frames:v 1 -q:v 3 POSTER.jpg
```

The separate hero source is `../workshop-intro.mp4`, from `ورشة التغيير.mp4`.
It uses the same encoding recipe, preserving 16:9 and a maximum width of 1280px.
Its metadata is in `config/workshop-intro-media.json`; its original file ID is in
`config/creator-media.ts`. Both the hero and portrait reels use only the centered play/pause button and
return to their thumbnails when finished. The hero poster uses the original
YouTube thumbnail, saved locally; its source URL is recorded in
`creatorMedia.workshopIntroThumbnailSource`. Portfolio posters remain one-second
frames extracted from the web copies.
