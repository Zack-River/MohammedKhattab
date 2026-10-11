# Client-approved design foundation

The client chose these two sites as the visual reference for this project and future pages:

- [Workshop](https://warshataltagheer.vercel.app/)
- [Personal brand](https://mohamedkhattab.vercel.app/)

Keep their visual language when adding pages. Do not introduce a new aesthetic, light editorial sections, scroll storytelling, or new animation/player libraries unless requested. The workshop reconstruction remains the workshop home page. Ta3allam is the unified app’s home page `/`; the personal portfolio is `/founder` and the workshop is `/workshops/7days-freelance`.

## Shared foundation

`packages/design-system/styles/theme.css` owns the canonical colors, typography, spacing, radii, layout widths and motion roles. `app/styles/theme.css` remains the workshop entry point and imports that source; `modules/styles/theme.css` imports it before explicit LMS deltas. Both references share `#101317` backgrounds, `#FC3522` accents, IBM Plex Sans Arabic, Arabic RTL typography, dark cards, restrained borders, and red primary actions. Fonts and assets are local.

The workshop retains its own elevated surfaces and component dimensions. Portfolio variants are explicitly named `--portfolio-*`, preserving the small differences between the approved references rather than replacing the workshop palette. Add base/reference variants in the canonical theme when a future page needs an existing reference treatment.

Use named palette, `--space-*`, `--radius-*`, and container tokens first. The `--size-*` aliases preserve the reference's exact additional measurements. Keep new shared visual values in the canonical theme and product-only roles in the product entry point. Structural values such as `100%`, `1fr`, aspect ratios, SVG coordinates, intrinsic image dimensions, and calculated DOM geometry are not theme constants. Native CSS media conditions cannot resolve custom properties; their literal breakpoints must agree with the documented breakpoint tokens used by hooks.

`packages/design-system/styles/fonts.css` declares the four local font weights. Root `app/globals.css` imports shared font, workshop and player styles directly; product theme variants stay in their own theme files. `packages/design-system/styles/workshop.css` contains the original responsive design, with its values replaced by theme references. `app/globals.css` only assembles these layers. Existing CSS hover/glow/marquee effects remain. `app/config/reference-motion.ts` centralizes the approved entrance groups, offsets and stagger timings; durations and easing use the shared motion roles; `use-scroll-reveals.ts` runs them once at the 75% viewport trigger through IntersectionObserver and native browser animations. Reduced motion skips entrances, and content remains visible without JavaScript. Animation effects are removed after completion so hover transforms remain available. There is no GSAP, Motion, Plyr, Tailwind, or class-merging runtime dependency.

## Reuse on subsequent pages

- `packages/design-system/ui/container.tsx`: shared page width and gutters.
- `packages/design-system/ui/section.tsx`: responsive section spacing; use `section-alt` for the original alternating dark surface.
- `packages/design-system/ui/action-link.tsx`: a styled action that receives its destination and label; contact configuration is supplied by the page.
- `packages/design-system/ui/creator-chip.tsx`, `reel-card.tsx`, `review-card.tsx`, `app/components/workshop/roadmap-day.tsx`: existing repeated content patterns.
- `packages/design-system/ui/social-links.tsx` and `social-icon.tsx`: shared social patterns that receive destinations through props.
- `hooks/`: mobile menu state, accordion state, deferred video state, navigation alignment, and roadmap progression.
- `config/site.ts`: identity, contact destinations, metadata, and social links.
- `data/workshop/content.ts`: complete typed page content, section identifiers, navigation, assets, actions, and interaction options. Shared creator/review records live in root `config/`; curriculum, FAQ and signup records remain adjacent. `app/data/workshop.ts` exposes only the complete page model.

Shared `eyebrow`, `section-heading`, `rich-text`, `microcopy`, `ui-icon`, and `asset-image` primitives own repeated presentation. SVG geometry and intrinsic image dimensions describe assets, rather than theme measurements. Rich text preserves the approved inline highlights without injecting HTML.

`components/workshop/index.ts` exports the complete `WorkshopPage` template and the individual sections. Every section accepts typed `content`, including `section` attributes such as `id`, `className`, and accessible labels. Compose individual sections for a different page order, or supply a complete `MarketingPageContent` object to retain the workshop template. Components and hooks do not import workshop data or site configuration.

Static sections remain Server Components. Add a Client Component only for interactive behavior, keeping state in a focused hook. Keep content and presentation separate, and compose the existing patterns before creating a new component.

## Exact reference copy

Apart from the user-requested real portfolio records, the current page uses the original wording in every section, including the header labels, introductory-video captions, all curriculum/review/FAQ records, closing action, and footer attribution. The countdown and signup popup retain the original visual treatment. No additional footer contact row or alternative workshop-details label is rendered. Copy is checked against a captured source fixture; section geometry is checked at 320, 390, 768, and 1440px.

Offer configuration lives in `app/config/offer.ts`. The default countdown reproduces the reference's visitor-specific window, persists its deadline through refreshes, and stops at zero. Set `NEXT_PUBLIC_DISCOUNT_ENDS_AT` to an ISO timestamp with a timezone for a shared campaign deadline. The source's viewer label and signup names are prototype display values, documented in `config/reference-ui.ts`; they do not represent a connected analytics/registration feed.

Existing working WhatsApp/contact configuration and the known YouTube embed remain integration settings, without changing the reference's visible text. The reference's client reels were placeholders; four curated user-supplied videos now populate that grid. All theme values stay centralized, including the source's inline spacing measurements. The CSS uses standard backdrop-filter declarations so Next.js compilation preserves the reference blur treatments.

Historical journey/player experiments remain recoverable from Git commit `5ae7b07`. Earlier research and performance documents describe that superseded version. No new animation/player dependencies are introduced by this copy.

## Customization and architecture checks

Types in `packages/design-system/types/ui.ts`, `marketing.ts`, `interactions.ts`, and `workshop.ts` define the reusable contracts. Keep section content in page data, contact settings in configuration, and visual measurements in the theme. Countdown, signup, and reveal hooks accept options; subscriptions and timers are local to the component instance and clean up on unmount. Store campaign deadlines under distinct keys. Keep options stable when passing them to hooks.

Motion selectors belong to page configuration: update them when changing section identifiers, or supply an empty group list. The timeline measures its current records, and FAQ/menu control IDs are unique per rendered instance. One site header owns document-level corridor alignment. Reels retain the approved card treatment, populated with the supplied portfolio files.

`tests/architecture.spec.ts` guards dependency boundaries, content/asset placement, and accidental Next.js special filenames. `tests/reusability.spec.ts` checks alternate content, assets, action destinations, record counts, independent control IDs, and isolated countdown storage. The active reference-copy/design and architecture acceptance tests compare the approved composition at four widths; initial reconstruction tools are archived under `docs/history/reference-tools/`. Native media-query literals mirror the navigation/mobile/small-mobile/compact-mobile theme breakpoint tokens.

## Portable reproduction specification

Use [DESIGN_REPRODUCTION_PROMPT.md](DESIGN_REPRODUCTION_PROMPT.md) as the complete prompt for reproducing this approved version. It includes exact implementation/CSS/content snapshots, responsive and interaction contracts, asset checksums, and verification instructions. Supply the original `public/assets/` folder and `package-lock.json` alongside it; binary assets and dependency resolution cannot be recovered exactly from prose alone.

## Verified shared architecture (2026-10-08)

All page modules depend on the private local `@khatab/design` package. Its `ui/`, `types/`, `hooks/`, `lib/` and `styles/` exports contain portable presentation and interactions. Page consumers import canonical shared exports directly; forwarding-only app/module files are prohibited by the architecture gate. Small product adapters are retained only where they select an explicit presentation variant. SectionHeading exposes an explicit badge/plain context variant; workshop uses badges and LMS uses plain optional context. Filled workshop icons and stroked LMS symbols are deliberate distinct icon sets. Do not collapse them into an untyped universal icon component.

`config/identity.ts` owns shared creator and platform facts. `config/fonts.ts` owns critical font URLs; shared FontPreloads registers server resource hints using React DOM. The final rendered font remains IBM Plex Sans Arabic. Weights 400–700 are bundled; 800/900 intentionally use browser synthesis to preserve approved heading weight. Structural CSS values, SVG coordinates, intrinsic asset dimensions and calculated DOM measurements remain local.

The shared reveal engine receives explicit targets/groups, owns each occurrence once, registers newly mounted targets and releases removed/completed effects. LMS components declare `data-reveal` contracts; the workshop supplies its original selector configuration. Reduced-motion subscription exists even on initially reduced visits, settles active motion and permits future unread targets after reduction is disabled. Completed effects release transforms so hover remains independent.

`scripts/generate-theme.cjs` exports concrete server palette and workshop motion numbers from canonical CSS before dev/build. Its resolver rejects missing/cyclic/unsupported expressions. Generated JSON is a build artifact, not a second palette. Certificate font JSON is generated from the local 700 TTF and imported only on the server. No runtime CSS/font filesystem lookup depends on cwd.

The unified application builds one standalone artifact. `scripts/prepare-standalone.cjs` stages fresh artifacts and local public/static assets; it never merges old build files. Follow [Architecture acceptance cases](docs/architecture/ARCHITECTURE_ACCEPTANCE_TESTS.md) and the execution ledger when validating changes to shared code.

Shared creator video references live in `config/creator-media.ts`. The workshop intro uses the original user-supplied `ورشة التغيير.mp4`; the earlier YouTube URL and seven Shorts remain source references. Portfolio metadata is not invented; supplied files now populate the original reel layout. LMS lesson previews remain clearly labelled demo material.

## Previous YouTube controls (2026-10-08)

The user requested custom playback controls. `HeroVideo` retains the approved initial frame/caption/hint and supplies content to shared `DeferredVideoPlayer`. The shared `YouTubePlayer`, `VideoControls` and dedicated player/fullscreen hooks own playback interaction. Labels are supplied through `VideoContent.controls` from `app/config/video-player.ts`; visual roles are canonical `--player-*` theme tokens. Root `app/styles/video-player.css` imports the shared control styles. LMS lesson playback is unchanged.

YouTube's API script and iframe load only after activation. The embed uses `controls=0`, `enablejsapi=1`, validated video IDs and the actual page origin. Custom controls include play/pause/replay, seeking/time, mute/volume and browser fullscreen, plus scoped keyboard shortcuts and retry feedback. The iframe is SDK-owned inside an empty React host, allowing safe destruction and retry. Polling is limited to active playback; instance timers and listeners clean up. No npm player package or download action was added.

YouTube branding/share/title UI remains provider-owned; deprecated branding parameters cannot remove it. Removing those provider icons entirely requires the original video file/direct hosted media source. The portfolio now has six original-file sources; the workshop intro uses its supplied original file too. Do not claim YouTube logo/share removal from `controls=0`, crop content, or invent a source.

## Real portfolio videos (2026-10-08)

Four curated Drive MP4s populate the workshop reels: China, baby-care products, hair care, and the store tour. All six source records and files remain available; `featured` in `config/portfolio.ts` controls the selection. Duration badges are omitted from both playable and placeholder cards.
The original card grid, portrait ratio, surfaces, hover treatment and creator marquee
remain. `config/portfolio.ts` owns source IDs/names and factual display copy;
`config/portfolio-media.json` records inspected durations, dimensions and file sizes.
`app/data/workshop/clients.ts` supplies the shared Arabic labels, file sources and
actual thumbnails to `ReelCard`. Other reference sections retain their wording.

`DeferredVideoPlayer` accepts either a YouTube URL or an explicit file source.
It mounts a backend only on activation. `NativeVideoPlayer` uses HTML video events
with `useNativeVideoPlayer`; both backends compose `PlayerShell`, `VideoControls`
and the fullscreen hook. Neutral time formatting and keyboard policy live in
`lib/player.ts`. Loading/error feedback sits outside the video viewport.
Native files have no provider UI or download action. Starting a native video pauses
other native videos; callbacks/listeners clean up. The 9:16 portfolio reels select
the overlay variant: the centered play button is visible only while paused; clicking the video pauses playback,
and finishing unmounts the player and restores the original thumbnail. A new click
starts a fresh playback instance at the beginning. Full controls remain available for other video placements. The workshop hero now explicitly selects the overlay variant too.

Web assets are local H.264/AAC progressive MP4s, limited to 1280px without upscaling,
with one-second frame thumbnails. This is a public playback test before access APIs;
there is no login restriction or download prevention in this phase. Reproduction
requires the new `public/assets/video/portfolio` and `images/portfolio` assets too.

The hero MP4 is `public/assets/video/workshop-intro.mp4`; its Drive ID/name and file
source live in `config/creator-media.ts`, and inspected technical metadata lives in
`config/workshop-intro-media.json`. It displays the original YouTube thumbnail (downloaded locally) with a centered play button,
then hides the play overlay during playback; clicking the video pauses it. Finishing
restores the thumbnail. Caption/hint strings remain supplied metadata; poster-backed
hero previews hide those overlays to keep the image clear. The workshop makes no
YouTube iframe/SDK requests for either hero or reels. `VideoSourceProps` is a typed
exclusive source contract shared by `VideoContent` and `DeferredVideoPlayer`.

Hero preview and behavior are configured through `VideoContent.poster`,
`controlsVariant` and `returnToPosterOnEnd`, supplied by the page data. `HeroVideo`
uses shared `AssetImage` for the eager thumbnail and shared `DeferredVideoPlayer`
for activation. It keeps the 16:9 ratio at every width; the full-player minimum
height does not apply to the overlay variant. No timeline/volume/fullscreen controls
are rendered for the current hero or reels. Other callers can still select full
controls or the legacy text preview explicitly.

The current hero poster is the original YouTube `maxresdefault.jpg` for
`h1G6qEPRIPg`, downloaded into `public/assets/images/workshop-intro-poster.jpg`.
Provenance is recorded in `creatorMedia.workshopIntroThumbnailSource`. The live
website requests only the local image, not YouTube; playback remains the supplied
MP4. Portfolio thumbnails still use one-second frames from their original footage.

## Reusable public player (2026-10-09)

`@khatab/design/ui/media-player` is the native-file player entry point. Supply
`videoUrl`, `thumbnailUrl`, `width`, `height`, and `color`; dimensions accept numbers
or CSS strings. The default is a responsive 16:9 player with the theme accent,
a centered play button while paused and thumbnail restoration. Labels default to the shared Arabic
configuration; optional controls, ratio and poster slots support other placements.
Both HeroVideo and ReelCard use it. Page consumers import the canonical player directly.

Appearance overrides are scoped to each instance using explicit dimension props
and `--media-player-accent`; all defaults live in canonical theme tokens. The player
button no longer depends on a reel-specific CSS class. Custom thumbnails are native
image elements so any supplied image link works without optimizer configuration.
Changing a video link resets deferred playback. Details and copyable examples are
in `docs/MEDIA_PLAYER.md`.

## Playback release on scroll (2026-10-09)

MediaPlayer defaults `resetOnScrollOut` to true. A dedicated viewport hook remounts
deferred state when a previously visible player leaves the viewport. Returning
shows only the poster until clicked again. Native cleanup pauses, removes `src`
and calls `load()` to cancel pending media responses and release buffered playback.
It also handles completion, source changes and component unmount. The native hook
restores its source after development effect replay and ignores cancelled play
promises. Overlay players have no pause button during playback: click the video
to pause, then click the centered play button or use Space/K to resume. Full controls
remain an explicit reusable option. No theme values or dependencies were added.

## Exclusive playback (2026-10-09)

The shared deferred player uses `useExclusivePlayer` to announce activation before
mounting a media source. Other deferred instances reset to their supplied poster,
even while paused or buffering. Native play events also claim playback on resume.
Reset unmounts the prior backend, invoking the source-release/abort cleanup.
The document-scoped subscription is per instance and removed on unmount; no app
data imports, providers or new dependencies are required. Switching back begins
at zero. The existing pause fallback for native videos outside this component
remains; full thumbnail restoration applies to shared deferred player instances.

## Shared website motion — 2026-10-09

The user requested smoother motion across the whole website. Canonical theme roles
now supply all page modules: `--motion-easing: cubic-bezier(0.4, 0, 0.2, 1)`,
300ms control/color feedback, 500ms surface/hover transitions, 500ms section
reveals and 120ms press feedback. Workshop reveal durations alias these roles;
LMS no longer redeclares its own motion timings. Existing offsets, layouts and
continuous decoration/marquee pacing are preserved.

Workshop-specific anonymous transition durations now use semantic roles. Card
lifts, buttons, icons, badges, highlights, borders, review cards and toast use
the shared easing. CSS transitions name explicit properties. No `transition: all`,
new animation package, scroll interception or permanent `will-change` was added.

FAQ panels in all page modules share the grid-track/opacity open and close treatment,
with a clipped inner wrapper; collapsed content is aria-hidden and inert. Mobile
menus remain mounted to fade/slide in both directions; a shared breakpoint hook
makes closed menus inert while preserving normal desktop navigation. Visibility
settles after closing; pointer input is blocked immediately. Reduced motion clears
delays as well as durations, and skips native entrance/player fade animations.

Player poster/active views and paused play buttons fade in at the surface duration.
Video release on scroll or another activation remains immediate; the old media
stream is not retained for an exit animation. The approved content, dimensions,
colors and source cancellation behavior remain. See `docs/MOTION_SYSTEM.md`.

## Reels/marquee investigation — 2026-10-09

Windows Brave's actual reduced-motion preference was the blocker behind static
reels and the stopped creator strip: Windows client-area animations were disabled,
Brave matched reduce, and computed transition/animation values were `none`. A
diagnostic-only preference override restored both without changing project code.
The website still respects reduced motion; no system setting was silently changed.

The user also requested right-to-left marquee travel. The wrapper now establishes
a left-aligned track origin while individual chips keep RTL content. Translation
is negative and includes the half-gap offset required for seamless duplicated
sets. Existing typography, spacing, duration and hover-to-pause behavior remain.
The new direction test failed before this correction and passes afterwards.

The user subsequently approved faster timing: surface/hover/player fades and
reveals now use 500ms, control/color feedback uses 300ms, and press feedback stays
120ms. The easing curve and marquee speed remain the same. Earlier Windows
diagnostic records describe the 1s timing observed before this update.

## Fullscreen video activation (2026-10-09)

Workshop hero and reel `MediaPlayer` instances keep `fullscreenOnPlay` disabled. Thumbnail activation plays inline; a top-right fullscreen button fades in on hover or keyboard focus. On touch screens the button stays available. Selecting fullscreen opens the outer wrapper in native fullscreen; portrait and landscape frames keep their intrinsic orientation without cropping. A themed, localized exit button remains visible during playback/pause/loading; Escape exits as well. Completion restores the poster and exits fullscreen. Shared consumers default to inline playback unless they enable this prop. Browser rejection keeps playback usable inline. No new dependencies or theme literals were introduced.

## Testimonial preview and expansion (2026-10-09)

Keep one wide featured review above three smaller review cards. `TestimonialsContent.expansion` centralizes `initialCount: 3` and the Arabic `showMoreLabel: "عرض المزيد"`. `ReviewList` owns expansion state and reuses `ReviewCard`; the section retains its server-rendered heading and featured review. A centered text button uses the primary red and gains an underline on hover. Activation reveals the remaining reviews with the shared fade duration and removes the button. Other section consumers without expansion settings retain their full review list. Layout spacing, focus treatment, color, and motion reuse shared tokens; reduced motion skips the reveal fade.

Fullscreen and exit toggles are icon-only: no background or button border, including on hover/focus. White SVG icons use a compact black drop shadow for contrast against light video frames; sizing, hit area, hover fade and fullscreen placement retain the shared player tokens.

## Shared workshop / Ta3llam media composition (2026-10-09)

Creator work cards, creator marquee, author identity, review cards/list, featured testimonial, work-sample/testimonial sections and hero video now live in `packages/design-system/ui/`; workshop and LMS consumers import those canonical implementations directly. Common intro and proof content live in `config/marketing-intro.ts`, `marketing-proof.ts`, `workshop-clients.ts` and `student-reviews.ts`. Ta3llam uses the same four featured source videos, player policy, fullscreen controls, thumbnail reset and testimonial expansion. Its LandingModel accepts optional, orderable work-sample/testimonial sections and an optional hero video. Product copy, course navigation and existing shared motion tokens stay in their established owners. The root `public/` directory supplies media to every page; there is no asset sync or duplicate public directory. No independent portfolio source project was changed.

## Personal portfolio (2026-10-09)

Preserve the supplied personal site’s original seven sections, markup composition, text, image treatments, editorial grids, timeline alignment, uncaptioned work players, course card structure and responsive breakpoints. Do not replace them with newly designed sections. `app/page.tsx` stays thin; `modules/features/portfolio/` composes focused typed components from `modules/components/portfolio/`. `config/personal-portfolio.json` owns the reference text, course announcements, contacts and accessible labels. Common client identities and actual video files remain in `config/workshop-clients.ts`.

`modules/styles/portfolio.css` is derived from the archived original stylesheet using `python3 scripts/prepare-portfolio-styles.py`. The generator scopes selectors under `.personal-site`, prefixes original component classes with `p-ref-` to prevent collisions, removes unused showcase/lightbox rules, centralizes source palette/dimension constants in the canonical theme and replaces transitions with shared 500ms timing/easing. Shared primary/background/font aliases retain the approved theme. Retain the original portrait frame and halo, mobile centered hero, editorial quote/values layout, spaced timeline headers, client avatar grid, 9:16 uncaptioned work players, whole-card course links and footer composition.

The user subsequently requested actual YouTube titles and view counts. `config/portfolio-youtube.json` now owns six verified asset/video associations and metadata snapshots; `config/workshop-clients.ts` derives the four displayed cards from these records. Portfolio, workshop and Ta3llam retain published titles in their video metadata; the user subsequently requested removing visible reel titles and view counts from all three pages. Refresh manually with `python3 scripts/sync-youtube-metadata.py`, then rebuild all page modules. Counts are snapshots, not a live browser/API counter. Videos use the supplied real MP4 resources through `MediaPlayer`, with inline playback, click-to-pause, exclusive activation, offscreen cleanup, end-to-poster reset and manual hover/focus fullscreen. Work thumbnails use the same per-video poster assets as the workshop and Ta3llam work-sample sections. Reduced motion skips entrance/halo/hover movement. No new runtime libraries are installed. Upcoming source course announcements do not create courses in the LMS catalog or API.

The portfolio navigation preserves the original five section links. Ta3llam’s instructor navigation opens `/portfolio`; workshop and collaboration destinations retain their original public URLs. A source-HTML comparison test preserves the ordered section/footer copy, excluding the user-authorized removal of reel captions and replacement of the upcoming course thumbnail. Tests assert that captions are absent, the shared upcoming artwork is present, and the available workshop retains its thumbnail and registration badge.

## Reusable upcoming artwork

`@khatab/design/ui/coming-soon` replaces the upcoming portfolio course image and corner badge with a bold teaser poster: white Arabic headline, optional outlined background lettering, and a diagonal primary-red strip on the shared dark surface. Its required `label` comes from page content; optional `detail`, `className`, `width`, `height`, `aspectRatio` and `color` allow reuse for other upcoming courses or features. It is a Server Component with no asset, page-data or animation dependency. Shared CSS is assembled in both app global stylesheets. All colors, spacing and type sizes use canonical theme tokens, including container-relative `--coming-soon-*` typography and composition roles. Decorative text is hidden from assistive technology; all visible copy comes from component props and the portfolio content configuration. Existing available-course thumbnails and course content remain unchanged.

The revised coming-soon poster takes conceptual inspiration from online typographic teaser designs (see `docs/evidence/coming-soon/research/README.md`). It uses live HTML/CSS rather than downloaded artwork, scales typography to the component container, and preserves the existing card layout.

## Unified application routes

One root `app/` owns every route, layout and API handler. Portfolio `/founder`, Ta3allam `/` and workshop `/workshops/7days-freelance` retain their approved page compositions and share the root font/theme/player styles. `/portfolio` and `/workshop` are compatibility redirects. `config/project-navigation.ts` owns main-page destinations and cross-page labels; `modules/config/navigation.ts` derives its home/portfolio/workshop links from that source. Headers keep page-specific section navigation, while the data-driven shared `ProjectNavigation` footer component connects all three pages. Existing source-copy assertions exclude only these user-authorized cross-page links and prior media changes.

The portfolio and LMS layers remain under `modules/` using `@platform/*` imports; workshop layers remain under `app/components`, `app/data` and `app/hooks`. These are feature modules in a single app. Root `public/` is the canonical asset directory, with `modules/public` a compatibility symlink. Build and start from the repository root. There is no iframe or separate app build behind the new pages.

Root `app/page.tsx` is the Ta3allam landing. Catalog and auth pages live in `app/(public)/`; protected dashboard and lessons live in `app/dashboard/` and `app/learn/`. Founder and workshops have independent page compositions under `app/founder/` and `app/workshops/[slug]/`. Route builders remain centralized in `modules/config/navigation.ts`. Old `/ta3allam/*` and `/ta3llam/*` URLs redirect once, preserving queries and anchors. Public user profiles are deferred. This routing change does not alter the approved page designs.

Instructor sections accept an optional `action` record. The workshop supplies a primary portfolio action below its statistics; the destination comes from `projectRoutes.portfolio`, the Arabic label from the workshop content model, and spacing from the shared theme. Consumers that omit the action keep their existing layout.

Designer attribution uses the shared `DesignerCredit` component and a typed credit prop. `config/designer.ts` centralizes “Designed By Zack River” and `https://zackriver.com`; the component renders an LTR text link and transitions to `--primary-red` on hover/keyboard focus. Portfolio, workshop and public Ta3allam footers bind that record through their content/composition layers. Alternate consumers may omit or replace the attribution without inheriting a hardcoded identity.

## Single-project workspace (2026-10-09)

The root is the only application project: one package-lock.json, dependency installation, Next configuration, App Router and build. Portfolio/LMS source lives in `modules/`, imported through `@platform/*`. Site and platform tests share the root Playwright configuration; the alternate-content fixture lives under `tests/platform/fixtures/reuse/` and uses root dependencies and public assets. `packages/design-system/` is an internal reusable library, not another website. Historical setup/audit records live under `docs/`; follow README.md for current commands. No UI, theme, copy, media or public-route changes are part of this organization.

## Focused functions and helpers (2026-10-09)

Shared media/motion/browser/theme operations live under `packages/design-system/helpers/`. Workshop geometry lives in `app/helpers/`; portfolio DOM operations live in `modules/helpers/portfolio/`; catalog and learning calculations live in each feature's `helpers/`. Hooks retain React state and lifecycle coordination. Owned section models bind content in `features/*/models/`. These extractions preserve DOM structure, copy, tokens and interaction behavior; helper code does not supply a new theme or animation system.

The architecture gate enforces small executable functions and files and traverses helper dependencies. Read [Function boundaries](docs/architecture/FUNCTION_BOUNDARIES.md) before adding behavior. Rendering/immutable data have separate limits so central theme values and source records remain centralized.

## Audited reuse contracts (2026-10-10)

Shared instructor, transformation and FAQ sections live in `packages/design-system/ui/`, with explicit badge/plain context and reveal options. Workshop uses defaults; LMS composition supplies plain context and reveal. Canonical creator destinations live in `config/creator-contacts.ts`; portfolio destination variants preserve the approved reference. `personal-portfolio.json` preserves source copy/provenance, while `personal-portfolio-model.ts` binds live destinations and validated action presentation. Actions carry their own icon, variant and external policy; caller-supplied section IDs must be unique within a document.

Lessons use the shared deferred player and viewport/session reset lifecycle. Both media providers honor controls/end callbacks; native and SDK setters share finite bounds. Async learning commands own pending state across enrollment and progress together. Client HTTP decoding and server request parsing are separate.

Theme cleanup removes obsolete captured literals, not published semantic contracts. `--color-canvas`, `--color-brand`, `--portfolio-radius`, small/compact breakpoint roles and reference/responsive easing roles remain deliberate compatibility/design vocabulary. Workshop reveal tokens are consumed through generated names and server projections. Different role names with equal values remain independent when their design meanings differ. Portfolio generation prunes unused generated roles and cannot resurrect removed captions/badges.

## Supabase account screens

`/login` and `/signup` use the existing two-column account layout: a large Arabic heading with the shared `text-red` accent, a dark bordered form card, full-width primary action, and mobile stacking. No new palette, typeface, animation library or dependency is introduced. `modules/styles/auth.css` references the existing canonical theme tokens.

`modules/data/auth.ts` owns both page models, labels, hints, error messages and account/confirmation notices; `modules/config/auth.ts` owns field lists and validation limits. `AuthPage`, `AuthForm` and `AuthFieldInput` compose the screens; reusable `FormField` and `PasswordField` own accessible labels, error descriptions and visibility controls. `useAuthForm` coordinates form events, request state and navigation; pure validation/normalization/response helpers live in `modules/features/auth/helpers/`. The same validator is used by both forms and thin Next.js POST adapters at `/api/auth/login` and `/api/auth/signup`.

Supabase Auth now verifies credentials and owns password hashing and sessions. Login opens the protected dashboard; signup requiring confirmation displays an email notice and remains on the form until verification. Logout clears the browser session. Profile email changes wait for provider confirmation. Components retain the same approved visual composition; route models supply account labels and feedback. Names are trimmed and limited to 2–60 characters, email addresses are trimmed/lowercased and validated up to 100 characters, passwords retain their exact input and require 8–128 characters, and signup confirmation must match. Inputs have autocomplete metadata, required flags, field-level errors and focus on the first invalid field. Pending requests disable form controls; errors permit retry. Profile editing retains its existing independent workflow.

## Administrator pages (2026-10-11)

`/admin/dashboard` reuses the private dashboard shell with Users and Courses navigation. Tables, user details and confirmation dialogs use the existing dark surfaces, borders, red actions, IBM Plex Sans Arabic and motion tokens. Content is passed through typed label props; account reads and moderation are server features. Desktop uses aligned account columns with avatar/name/role and bounded identifiers. At 1024px and below, the same semantic table reflows into stacked records; at 480–1024px username and email sit beside each other. Neutral row hover preserves hierarchy. View and Manage are the visible student actions; moderation controls are grouped in a shared native modal, with separate confirmation for restrictions, promotion and deletion. Controls have a minimum 44px height, modal focus returns to the opener, and long identifiers stay fully available on private details. `PageHeading` accepts level 1 or 2 for correct heading structure without changing typography. Administrator detail pages are private and do not introduce public user profiles. See `docs/ADMIN_DASHBOARD.md` for research and responsive behavior.

## Administrator search and pagination (2026-10-11)

The account list returns at most five users per page at every viewport, so phone pages never contain more than five account cards. Above the table, a token-based dark search/filter panel uses the shared primary and secondary buttons. Checkbox labels provide 44px touch targets and red selection feedback. Controls wrap on larger screens and form a two-column grid at 480px and below. A GET form combines name/username/email search with Suspended, Banned, Admin-only and last-seven-days Newcomers filters. The URL owns applied choices; submit resets page one, pagination retains filters, Clear resets all, and the result total is calculated before pagination. New content remains in `modules/data/admin-users.ts`; behavior/limits remain in configuration and query helpers.

Administrator management and confirmation dialogs explicitly use fixed positioning, zero viewport insets and automatic margins. This restores native two-axis centering after the shared zero-margin reset; viewport height bounds and internal scrolling still apply.

## Shared form controls

Import `Select` from `@khatab/design/ui/select` and `Checkbox` / `Radio` from `@khatab/design/ui/choice-controls`. The global entry imports `packages/design-system/styles/form-controls.css` once. Visual roles (`--control-*`) live beside the canonical theme; typeahead timing lives in `packages/design-system/config/form-controls.ts`. Do not create page-specific control copies.

`Select` receives `label`, `options: { value, label, disabled? }[]`, optional `name`, `id`, `value`, `defaultValue`, `onValueChange`, `required`, `disabled`, `placeholder`, `validationMessage` and `className`. Use controlled value/callback for state or defaultValue/name for forms. A hidden native select provides native validity and FormData. Required errors focus the visible combobox, associate its message, and clear on selection; form reset resets both local and controlled values through the callback. Arrow keys/Home/End, text search, Enter/Space, Escape and Tab are supported. Disabled options are skipped. Native top-layer popovers stay inside their modal DOM, escape scroll clipping and flip/clamp to the viewport. Escape dismisses only the active menu. Outside clicks light-dismiss it.

`Checkbox` and `Radio` receive a visible `label`, optional `hint` and native input attributes, including `name`, `value`, controlled `checked`/`onChange`, `defaultChecked`, `required` and `disabled`. They retain native keyboard, validation, form-reset and form-submission behavior. Group radios in a named fieldset with a legend. Custom markers use a red checked state, visible gray unchecked outline and a distinct focus outline; labels provide 44px targets. Controls inherit RTL/font/colors, use shared easing and respect reduced motion.

Keep selectors wide enough to read their values. In the management modal, the duration selector wraps onto its own row on phones and the action remains a normal-height button; do not stretch a button to the selector-plus-label height.

## Account menus and settings (2026-10-11)

`@khatab/design/ui/avatar` and `action-menu` are shared presentation primitives. Avatar receives its image URL, name and accessible label. ActionMenu receives a trigger, link records and one action; its popover closes on outside click, focus leaving or Escape. Placement follows the viewport and keyboard navigation remains inside the visible choices. Menu width comes from the canonical `--action-menu-width` token; surfaces, borders, typography, radii and transitions reuse existing theme roles. Product destinations, WhatsApp support and Arabic labels belong to account configuration/data, never the shared package.

Owned profile/settings pages use the existing dashboard shell, dark profile-card surface, form fields and password toggles. First/last names share two columns and collapse at the existing small-mobile breakpoint; stacked cards and definition lists fit 320px. The primary save action retains the existing red treatment. Student emails are read-only; administrative email changes and phone/password changes require reauthentication. Contact confirmation and recovery status are server-owned API data. No separate visual identity, animation framework or email UI library is introduced.

## Session-aware public navigation (2026-10-11)

Public header presentation receives an optional `{ href, label }` account destination. A server adapter validates the Supabase user, moderation access and trusted admin membership; guests receive no account destination. Guests see the existing primary “ابدأ التعلّم” action. Signed-in students see “لوحة التعلّم” linking to `/dashboard`; administrators see “لوحة الإدارة” linking to `/admin/dashboard`, with the guest action hidden. The home route and public authentication routes refresh sessions through the existing proxy. Authenticated navigation is request-specific, never a shared cached user snapshot. Workshop navigation links are removed from shared project navigation and marketing navigation; the workshop stays available through its course/catalog destination. All existing theme and mobile-menu behavior remain unchanged.
