> Historical evidence for the superseded journey/player redesign. The current reference reconstruction is documented in `DESIGN_SYSTEM.md`; these results do not measure its performance.

# One clip, one consequential decision

Implemented 2026-10-02 from the proposed first-edit journey. Direction: a student's first editing desk, using the established charcoal, paper, red and IBM Plex Arabic theme. The recognizable coffee shot connects the opening, scroll assembly, interactive decision, lesson outcomes and closing result. One selected rhythm carries across the experience.

## Narrative

1. Opening: eight seconds of raw coffee footage, available for explicit playback.
2. Process: the same image enters the scoped GSAP desk choreography; readable story beats explain trimming, rhythm and caption decisions.
3. Try: choose calm or energetic. This selects an actual six-second continuous edit or a 4.2-second three-cut edit. Visitors can compare with the eight-second raw source. Motion mini animates interrupted selection changes.
4. Learn: seven selectable day outcomes preview trimming, caption, grading, review and final presentation. Full original lessons remain below.
5. Proof: the existing permitted YouTube embed shows Mohammed's published work separately from the credited training footage. No stock clip is presented as Mohammed's or a student's work.
6. Finish: play the selected version, read an accurate recap, change the choice or contact Mohammed. Direct arrival without choosing is described as a calm preview, not a completed personal achievement.

## Ownership and performance

- `app/data/first-edit.ts`: media paths, rhythm definitions and outcomes.
- `FirstEditProvider`: only the rhythm and whether a visitor actually chose it. No frame-by-frame React updates or storage permission needed. State lasts for the current page visit.
- `ClipPreview` + `useClipPlayback`: reused media, explicit playback, native controls, error fallback and offscreen pause. No video URL is assigned until playback is requested; posters are local WebP. Edited MP4s contain the real cuts/grade, while captions are HTML overlays.
- `EditPreview` + `useEditPreview`: comparison state and the existing lazy Motion mini lifecycle. Rhythm changes also retrigger the scoped transition.
- `LessonOutcomes`: local day selection and a single current preview, with keyboard-operable buttons and pressed states.
- `FinalEdit`: selected result with honest default state.
- Existing GSAP context owns only the editing-desk layers. Native scroll, CSS sticky, reduced-motion cleanup and static readability remain intact.

Asset details and licensing are in [video README](../../public/assets/video/README.md). The three H.264 videos total approximately 707 KiB, plus an 8 KiB poster. Media playback is silent; no music rights or unverified raw footage are implied.

## Sources

- [GSAP React guidance](https://gsap.com/resources/React)
- [Motion scroll examples](https://motion.dev/examples?category=scroll)
- [Ableton interactive learning](https://learningmusic.ableton.com/)
- [NN/G scroll fading research](https://www.nngroup.com/articles/scroll-fading-101/)

## Validation

The existing journey/regression suite is extended with four end-to-end checks: selection continuity, real lazy playback/offscreen pause, raw/edited durations with interrupted choices, and keyboard/direct-finish behavior at 320px. CPU-throttled scroll evidence for this build is collected separately from the previous redesign evidence.

Verified: all 23 browser checks passed, production build and lint passed, strict TypeScript passed, and the final hero layout passed the responsive regression after visual adjustment. All six CPU-throttled scroll trials recorded zero long tasks and no intervals above 50ms; see [the measured comparison](../evidence/FIRST_EDIT_PERFORMANCE.md) for scope and limits.

The subsequent custom-player change replaces the original `useClipPlayback` hook with `MediaPlayer` / `useMediaPlayer` and shared Plyr controls. The explicit playback gate and offscreen pause remain; source URLs, Arabic labels and player policy are centralized. See README’s custom-media-player section for current validation and licensing.
