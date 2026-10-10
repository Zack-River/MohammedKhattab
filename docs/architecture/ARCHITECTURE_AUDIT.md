# Reusable reference architecture

The client-approved workshop design remains the foundation. This refactor changes content ownership and component boundaries while preserving its rendering.

| Responsibility                                                       | Owner                                                      |
| -------------------------------------------------------------------- | ---------------------------------------------------------- |
| Route entry                                                          | `app/page.tsx`                                             |
| Full-page composition                                                | `components/workshop/workshop-page.tsx`                    |
| Independently reusable sections                                      | `components/workshop/index.ts`                             |
| Shared visual primitives                                             | `components/ui/`                                           |
| Copy, IDs, assets, actions, page options                             | `data/workshop/content.ts`                                 |
| Repeated content records                                             | `data/workshop/{clients,curriculum,reviews,faq,signup}.ts` |
| Identity, contact, offer, reference defaults                         | `config/`                                                  |
| Typed UI/content/interaction contracts                               | `types/`                                                   |
| Local interactive state and subscriptions                            | `hooks/`                                                   |
| Pure countdown/video/timeline functions and browser animation engine | `lib/`                                                     |
| Central visual values                                                | `styles/theme.css`                                         |

Sections receive explicit typed content rather than importing global workshop data. Shared primitives have no feature dependencies. Repeated action, heading, eyebrow, microcopy, image, social, author, stage, and curriculum patterns have single renderers. Static sections stay on the server; interactive leaves own their hooks. The largest component is a focused navigation renderer, rather than a page containing content and state.

The SOLID applications are concrete: composition, presentation, state, and calculations have separate responsibilities; new content uses existing renderers without editing them; shared interfaces describe each component's inputs; sections depend on supplied contracts rather than concrete workshop records. No inheritance hierarchy, global store, or runtime dependency was introduced.

Reuse fixes include unique FAQ/menu IDs, configurable social destinations, video activation tied to the current URL, timeline marker remeasurement, Escape handling scoped to an open menu, and independent campaign deadline keys. Countdown refresh cadence no longer controls elapsed seconds. Storage failures fall back to a mounted-session deadline.

Automated guards reject data/config imports in renderers and hooks, business copy or asset URLs inside components, and accidental Next.js special-file names in reusable modules. Alternate-content SSR checks run in a separate Node process because Playwright's JSX transform produces its own component representation. Existing browser checks cover copy, responsiveness, hydration, controls, media, countdown, and motion.

The reference stylesheet contains no raw colors or visual dimensions outside native media conditions. Structural CSS values, SVG paths, intrinsic asset dimensions, time-unit conversions, and measured geometry remain appropriate implementation values. Media breakpoints mirror documented theme tokens. Page-level motion selectors are configurable and must follow custom section IDs. One site header owns the global corridor measurements.

This validates the supplied contracts and current design, rather than claiming every possible future content combination is automatically correct. Reels remain reference placeholders; viewer/signup labels remain documented prototype values. Future pages can compose the exported sections independently or use `WorkshopPage` with a complete `MarketingPageContent` object. See `DESIGN_SYSTEM.md` for the design contract and `docs/evidence/component-refactor/` for validation.
