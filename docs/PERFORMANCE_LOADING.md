# Loading investigation — 2026-10-11

A read-only Chromium pass across six public and five admin routes is recorded in `docs/evidence/performance-2026-10-11/live-before.json`. It is a single warm-network diagnostic run from WSL, not a Core Web Vitals benchmark. Streaming header TTFB was about 60ms but did not indicate when page data was ready. Dashboard session requests took roughly 0.9–1.1s on several routes, after server authorization; the client hid the entire dashboard during those requests. The first home navigation transferred roughly 960KB of images. Later route byte totals reflect the browser cache and cannot be treated as cold per-route bundle sizes.

The live response's `x-vercel-id` identified `iad1` execution, while the supplied database pooler is eu-west-2 (London). `vercel.json` now selects `lhr1` to keep functions near the database. No user permissions or deployment credentials are changed.

## Changes

- Server-authorized initial dashboard HTML renders immediately. Client route changes, browser back/forward and BFCache restores retain live session checks. A persistent root history boundary catches restores even when the dashboard was unmounted. Server getUser/access/role checks and RLS remain authoritative.
- Proxy refresh uses verified getClaims; protected server pages still use live getUser and account access checks. Admin-role and student-state reads are deduplicated only within the current React server render, never cached globally across users or requests. Student layout reads run concurrently.
- Native/YouTube playback modules use lazy imports and load only upon activation. Streams still wait for play and reset on another player, completion and leaving view.
- Chart plotting/Recharts mounts within a 200px viewport margin, with a fixed themed-height placeholder. The daily numerical table and page content remain server-rendered.
- Local AssetImage files use Next responsive image optimization; arbitrary remote image URLs retain the existing unoptimized contract. The instructor uses the already-existing 60KB WebP instead of the 1.6MB PNG. Browser image lazy loading remains enabled.
- Shared reveal scopes now cover public account pages and protected dashboards. Headings, analytics panels, account/settings cards, phone-request cards and the users list opt into the existing fade engine. Reduced motion skips effects; animations release transforms when finished. Marketing/workshop reveal contracts remain intact.

## Validation

The isolated backend suite passed 190 checks, including guest/student denial, cookie loss, logout/back restoration, role revocation, media streaming, moderation, and enrollment protection. The new performance suite passed 11 checks for server HTML, zero initial session requests, viewport chart deferral, playback-on-demand, optimized local images, reduced motion and zero browser errors. Build/TypeScript, lint and architecture passed. Local production analytics and settings checks passed; desktop alignment waits for fades to finish before measuring visual edges.

Reproduce timing collection with `TARGET_URL=https://ta3allam.vercel.app OUTPUT=docs/evidence/performance-2026-10-11/live-after.json node tests/backend/performance-live.cjs`, using the ignored local admin credentials. No personal data, tokens, or passwords are written to the report. The local production probe is recorded in `local-after.json`: all five admin hard navigations make zero browser session checks; account/admin reveal targets register correctly. Its first home image transfer was about 270KB versus the older live baseline of 960KB. These environments differ, so this is not a live speed comparison. Six media/responsive tests passed.

Commit `48b33df` is pushed. GitHub’s latest recorded Vercel deployment still points to `75ef4df`; no deployment/check entry exists for `48b33df` at the time of checking. The attempted live comparison in `live-still-previous-build.json` still has the old initial session calls/image bytes and must not be presented as the new code. The user was asked for the Vercel deployment status/error; hosted region and speed verification remain pending.

References: [Supabase SSR clients and verified claims](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [Vercel function regions](https://vercel.com/docs/functions/configuring-functions/region). Implementation followed installed Next 16.3.8 lazy-loading/image/caching documentation.
