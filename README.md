# ورشة التغيير — Next.js

An Arabic RTL workshop landing page, redesigned as a beginner’s first-edit journey from the public workshop page at [warshataltagheer.vercel.app](https://warshataltagheer.vercel.app/), migrated to the Next.js App Router.

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then serve it using `npm start`.
Set `NEXT_PUBLIC_SITE_URL` to the deployed origin so social preview URLs use the new deployment domain.

## Project notes

- `app/page.tsx` composes the header, nine content sections, and footer from `app/components/workshop/`.
- `app/data/workshop.ts` holds repeatable workshop content and the video URL. `app/data/journey.ts` owns chapter labels, story beats and the illustrative before/after demo.
- `app/config/site.ts` owns identity, metadata, contact details, enrollment links, and social links.
- `app/config/motion.ts` owns animation settings and reveal profiles; distances use CSS tokens.
- `app/types/workshop.ts` defines roadmap variants and FAQ contracts.
- `app/hooks/` owns local interaction state and browser lifecycles. `app/lib/` contains shared token access, navigation helpers, timeline calculations, and video URL policy.
- Sections render on the server; interactive leaf components own video playback, FAQ expansion, timeline progress, counters, the native horizontal gallery and the before/after demo. The header is a client component because navigation is interactive.
- Entrance targets opt in using `data-motion`; the editing desk uses scoped `data-edit-*` targets. Each transform has a separate owner.
- Tailwind v4 owns component styling. `app/styles/theme.css` defines the semantic palette, typography, widths and effects; `app/globals.css` holds imports and baseline rules. Metadata reads the canonical palette, and Next.js includes that file in server tracing.
- `app/components/ui/` provides reusable containers, sections, headings, cards, and button links. `app/lib/cn.ts` merges class overrides safely. See [THEME.md](THEME.md) for examples and conventions.
- Navigation and the editing story consume Tailwind’s `lg` breakpoint directly. Native scrolling and CSS sticky own layout. Motion hooks subscribe to preference changes.
- Image source dimensions are asset metadata in site configuration; avatar display dimensions come from CSS.
- `public/assets/` contains local images, flags and Arabic fonts (font license included). Entrances use a shared IntersectionObserver and native Web Animations. GSAP/ScrollTrigger load when the desktop editing story approaches the viewport; Motion mini loads after demo interaction.
- `content/workshop.html` is a saved source snapshot for reference; the Next.js page does not render it.
- `scripts/prepare-reference.py` refreshes that source snapshot when needed.
- The original page did not contain a working checkout URL. Enrolment buttons now open WhatsApp using the phone number supplied for Mohammed.
- A real video from Mohammed’s YouTube channel appears in the proof section beside the training demo because the source page left its video URL blank.
- The reference simulated live viewer counts, a rolling scarcity timer, and recent signup notifications. The recreation replaces these with a fixed seven-day workshop label and omits the simulated counters and signup popups.

The source copy describes the workshop, schedule, instructor, testimonials, guarantee, and FAQs. Confirm business details, pricing, and promises with Mohammed before publishing as a live sales page.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

Browser regressions target a running production server:

```sh
npm start -- --port 3022
# In another terminal, after installing Playwright's Chromium:
npx playwright install chromium
npm run test:e2e
```

For an existing Chromium-compatible browser, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path instead of downloading Chromium. Set `TEST_BASE_URL` to test a different server address. The tests cover real stat animation, FAQ expansion, mobile navigation, video embedding, contact consistency, reduced motion (including changes after load), timeline progress, breakpoint resizing viewport overflow, staggered scroll entrances, visible timeline fill, hover movement, press feedback, horizontal scrolling, keyboard gallery controls, editing-desk choreography, before/after interaction, chapter milestones, live cleanup, and reading without JavaScript.

See [ARCHITECTURE_AUDIT.md](ARCHITECTURE_AUDIT.md) for resolved findings and remaining architectural limits.

## Scroll experience

The page follows six chapters: begin with an idea, see a clip assemble, try an editing decision, explore the seven days, meet the teacher, and reach a clear finish. Read [the UX storyboard](docs/research/UX_JOURNEY.md) for the design and researched skills.

CSS sticky keeps the editing desk beside three narrative beats. A single scoped GSAP timeline rotates and frames the clip, brings in its caption and audio, and marks it ready. No JS pin/spacer changes the page's height. Mobile and reduced-motion users see the complete static illustration.

The before/after demo uses dynamically imported `motion/mini` and native browser animation. The horizontal gallery uses native scrolling with button/keyboard controls and cached geometry. Simple entrances use one IntersectionObserver and native animations; the hero stays readable from its first paint. Counters write DOM text only when the displayed integer changes. Chapter navigation updates only at milestones; the reading line uses a native CSS scroll timeline.

Settings live in `app/config/motion.ts`; colors, type and geometry live in `app/styles/theme.css`. Each animation has scoped cleanup and responds to live preference changes. The credited training clip uses actual raw/cut footage; Mohammed’s published YouTube example remains playable in the proof section. Portrait and avatar WebP files are preoptimized; source images remain available.

## Performance evidence

With the production server running, reproduce a three-trial, CPU-throttled scroll diagnostic:

```sh
node scripts/profile-scroll.mjs docs/evidence/scroll-after.json
```

Set `TARGET_URL` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if needed. The profiler records script, layout/style/task durations, frame intervals, transfer sizes and trace hotspots. These are local synthetic comparisons rather than real-user phone measurements. See [the performance report](docs/evidence/PERFORMANCE.md).

## First-edit experience

One credited coffee clip follows visitors through the opening, editing desk, rhythm choice, seven selectable learning outcomes and final playback. The calm/energetic choice changes actual encoded cuts and carries across the page via a small scoped context. Three compressed local MP4s download only after playback is requested and pause offscreen. Mohammed’s published YouTube example is presented separately; stock footage is never labeled as his work or a student result.

See [the first-edit implementation notes](docs/research/FIRST_EDIT_JOURNEY.md) and [footage provenance](public/assets/video/README.md). The browser suite now includes 28 production checks and one development-only hydration diagnostic. Prior scroll evidence describes the previous build; subsequent profiling uses `docs/evidence/scroll-first-edit.json`. See [the new build’s performance report](docs/evidence/FIRST_EDIT_PERFORMANCE.md).

The root body tolerates browser-extension attributes using `suppressHydrationWarning`; descendant checks remain active. `tests/hydration.spec.ts` simulates ColorZilla’s document-start injection and verifies page interactivity. Its child-warning control runs only against a development server, where React emits these diagnostics.

## Custom media player

All local clips and the YouTube example use the same lazy-loaded Plyr 3.8.4 adapter (watch, youtu.be, Shorts and embed URLs normalize to a validated privacy-enhanced URL), with Arabic controls and the global brand theme. Plyr is MIT licensed and needs no subscription or API key. `app/components/ui/media-player.tsx` is the reusable view; `app/hooks/use-media-player.ts` owns initialization, offscreen pause, retry and cleanup; `app/config/player.ts` owns controls and labels; `app/styles/player.css` maps appearance to theme tokens. SVG icons and the MIT license are hosted locally in `public/assets/player/`.

Download controls and local context menus are omitted. This controls the UI, not copying protection for browser-delivered media. YouTube uses its privacy-enhanced embed/API with provider branding and availability controlled by YouTube. Tests simulate the provider API contract and exercise real local video controls; actual network playback depends on YouTube. Plyr's upstream project has announced a future transition to Video.js; the current stable MIT version is isolated behind the adapter for future replacement.

Validation for the custom-player change: 28 production behaviors verified; the development-only hydration control is skipped on production. The final production build was verified with `npm run build -- --webpack` because the managed environment blocked Turbopack’s local CSS-worker port. This does not change the default build script.
