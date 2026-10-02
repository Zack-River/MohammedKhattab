# Shared Tailwind theme

The app uses Tailwind v4 through PostCSS, following the [official Next.js setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs). All brand decisions live in `app/styles/theme.css`; component styling uses utilities and shared React primitives. The default Tailwind spacing, radius and responsive scales remain available.

## Theme vocabulary

| Role | Utilities |
| --- | --- |
| Page background | `bg-canvas` |
| Dark section | `bg-section` |
| Warm-paper chapter | `bg-paper`, `bg-paper-panel`, `text-ink`, `text-paper-muted`, `border-paper-line` |
| Card / elevated control | `bg-panel`, `bg-elevated` |
| Action / hover / soft accent | `bg-brand`, `hover:bg-brand-hover`, `text-brand-soft` |
| Text hierarchy | `text-foreground`, `text-copy`, `text-muted`, `text-faint` |
| Borders | `border-line`, `border-line-strong`, `border-brand/35` |
| Typography | `text-display`, `text-chapter`, `text-day`, `text-hero`, `text-heading`, `text-lead`, `text-quote` |
| Content widths | `max-w-page`, `max-w-content`, `max-w-reading`, `w-reel` |
| Section rhythm | `py-section` |
| Shared effects | `shadow-card`, `shadow-brand`, `shadow-glow` |

Use standard scale utilities (`p-6`, `gap-4`, `rounded-xl`, `text-sm`) for ordinary layout. Use semantic tokens when a value has a shared product role. Opacity modifiers such as `bg-brand/10` derive from the same palette; they do not need separate RGBA tokens.

`theme.css` uses `@theme static` so tokens needed by metadata and browser effects remain available even when no utility references them. Edit the palette there to update all consumers. Browser `theme-color` reads `--color-canvas` from this file, which is included in Next.js output tracing.

## Reusable primitives

`app/components/ui/` contains `Container`, `Section`, `Heading`, `Card`, and `ButtonLink`:

```tsx
import Card from "@/app/components/ui/card";
import Container from "@/app/components/ui/container";
import Heading from "@/app/components/ui/heading";
import Section from "@/app/components/ui/section";

<Section id="services" alternate>
  <Container width="content">
    <Heading className="mb-8">خدماتي</Heading>
    <div className="grid gap-6 md:grid-cols-3">
      <Card as="article" interactive>
        <h3 className="mb-2 text-xl font-bold">المونتاج</h3>
        <p className="text-copy">وصف الخدمة</p>
      </Card>
    </div>
  </Container>
</Section>
```

All primitives accept native element props and `className`. `cn()` combines conditional classes and uses `tailwind-merge` to resolve conflicting utilities. Custom typography names are registered with its font-size group, so `Heading className="text-xl"` overrides its default heading size. Responsive overrides use matching prefixes, for example `Card className="p-0 sm:p-0"` overrides both default padding values.

`WhatsAppCta` remains a workshop-specific wrapper around `ButtonLink`: it supplies the canonical contact URL and label. Its `compact` variant is used in the header.

## Responsiveness and direction

Use mobile-first utilities and Tailwind's named breakpoints. The mobile navigation reads the actual `--breakpoint-lg` token for its media-query subscription; there is no second numeric breakpoint in JavaScript or handwritten viewport CSS.

Prefer logical properties (`text-start`, `border-s`, `start-*`, `me-*`) so components respect the document's RTL direction. Use grid/flex layouts instead of JavaScript width measurements. Header menus and accordions use unique React IDs; timeline queries are scoped to their own refs.

## Motion and custom CSS

Use `motion-safe:` for decorative movement and hover/press states, and `motion-reduce:` for transition resets. `useReducedMotion` subscribes to changes after load. Static content is always rendered by the server; animations do not determine access to information.

Entrances opt in using `data-motion`. A shared observer triggers native browser animations once, and completed elements are remembered. Hero entrances keep opacity at one for an immediate readable first paint. Entrance transforms and Tailwind hover's individual `translate`/`scale` properties have separate owners.

`useEditingStory` owns the GSAP transform/opacity targets inside `EditingDesk`; `EditingStory` owns its CSS-sticky layout. The desktop query reads `--breakpoint-lg` and `--motion-story-min-height`. There are no pin spacers or page-wide refresh observers. Do not add entrance transforms to the desk's animated layers or sticky wrapper.

`useEditPreview` owns Motion mini's transform/opacity on a separate demo layer, and restores it on interruption or reduced-motion changes. `useHorizontalShowcase` caches carousel offsets on resize and uses native scrolling. Chapter progress changes at IntersectionObserver milestones. The top progress line runs on a CSS scroll timeline when supported.

Timeline geometry is read on stable measurement wrappers and all reads finish before track dimensions are written. JS owns its scale transform; do not add a static `scale-y-0` utility. Roadmap hover remains scoped to its matching day; scroll-active markers highlight their own adjacent cards.

`globals.css` contains imports and baseline rules. `effects.css` contains only the video-poster background, film perforations and native reading progress utility. `fonts.css` registers local IBM Plex Arabic; its license remains in `public/assets/fonts/OFL.txt`. Use complete utility strings for variants so Tailwind can detect them. Do not introduce literal brand colors or section-selector styling sheets.
