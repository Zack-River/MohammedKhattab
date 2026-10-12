# Course details and featured workshops

The supplied `references/course-details.html` establishes the information structure: title/category, preview, description, curriculum and adjacent enrollment/instructor panels. Its WordPress administration UI, scripts, styles and other-site account names are not application content. The implementation uses Ta3llam's existing dark/red theme, IBM Plex Sans Arabic, components, native disclosures and reveal engine; it adds no package.

`/courses/[slug]` renders recorded courses. Live courses retain their canonical `/workshops/[slug]` destination. Ordinary workshops use the same details template. Only `delivery: "live"` plus `featured: true` selects the workshop marketing template. The admin overview and creation forms expose **ورشة مميزة** for workshops. Both create/edit APIs validate a boolean; omitted legacy edits retain the saved value. Recorded-course featured metadata used elsewhere is preserved, but cannot select this workshop template.

Migration `20261012170000_featured_workshop_template.sql` marks the existing seven-day workshop featured only if it has no saved setting. It does not override subsequent administrator choices or alter prices, media, enrollment or lesson content. The local seed also records that initial choice.

The original seven-day campaign keeps its existing copy, media and timeline. Other featured workshops receive their own curriculum modules as timeline cards and their own duration/delivery copy. Missing introductory media does not show the seven-day video's player. The remaining marketing sections retain the existing platform reference template.

## Composition and behavior

- `CourseDetails` is presentation only. The catalog page adapter supplies database course metadata, validated learning state, centralized copy and founder/contact configuration. Public navigation/footer composition is shared by recorded and ordinary workshop routes.
- `CourseOverview`, `CourseIntro`, `CourseDescription`, `CourseFacts`, `CourseInstructor`, `EnrollmentPanel` and `CourseEnrollmentAction` have focused responsibilities and supplied data/copy. Preview client props exclude the full curriculum.
- `CurriculumChapter` and `CurriculumLesson` preserve named sections, unassigned lessons, durations and canonical lesson IDs. The same grouping helper serves admin and public views. Native `details/summary` works with keyboard and without JavaScript. Guests get free-preview links; enrolled users get links to their lessons. Playback APIs still enforce access.
- The shared deferred player supports native files/streams and individual YouTube links. Drive intros use the existing intro stream endpoint. Playback starts on activation, uses custom controls, returns to its poster on completion and releases playback on scroll-out. Missing media shows themed course artwork without a play button.
- Paid enrollment uses the existing checkout. Recorded enrolled learners continue their next lesson. Enrolled live workshops without recordings expose the configured workshop support destination; free live workshops without recordings offer booking there.
- Desktop uses a main content column and sticky enrollment/instructor sidebar. At 1024px and below, the reading order is title → preview → enrollment/instructor → description/outcomes/curriculum. Values reuse existing theme tokens. Static content remains server-rendered; images and playback retain deferred loading. Reveal targets use the existing reduced-motion behavior.

## Verification

`BACKEND_SUITE=course-details npm run backend:test` exercises protected feature changes, template selection, legacy workshop preservation, six widths (320–1920px), keyboard disclosures, preview/private links, deferred native/YouTube playback, poster/reset cleanup, missing media, checkout navigation, enrollment state and the actual admin featured toggle. Fixtures live only in isolated local Supabase; no payment is charged. Screenshots: `docs/evidence/backend/course-details-390.png` and `course-details-1440.png`.

`tests/security/featured-workshop.test.ts` covers delivery/featured selection, boolean validation, legacy omission and checked/unchecked form decoding. Existing course price, creation and curriculum helper tests cover shared form/grouping regressions. The reusable choice control names its label separately from its hint using stable React IDs; explicit accessible labels remain supported.
