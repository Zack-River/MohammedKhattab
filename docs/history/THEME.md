# Shared theme

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the client-approved visual references and rules for future pages.

`app/styles/theme.css` is the single source of truth for palette, typography measurements, spacing, corners, layout widths, and transitions. `app/styles/workshop.css` preserves the original responsive design and consumes those values. `app/styles/fonts.css` provides locally hosted IBM Plex Sans Arabic.

Prefer the original named color/space/radius tokens when adding styles; keep any new visual value in the theme file. Portfolio surface variants preserve the differences in the second approved reference. Native media-query conditions retain documented literal breakpoints.
