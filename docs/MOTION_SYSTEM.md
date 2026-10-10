# Shared website motion

All timing and easing defaults live in
`packages/design-system/styles/theme.css`. Workshop and LMS import that source.

| Role | Duration | Use |
| --- | --- | --- |
| `--motion-duration-control` | 300ms | Color, background and border feedback |
| `--motion-duration-surface` | 500ms | Hover movement, shadows, menus, FAQ panels, player fades |
| `--motion-duration-reveal` | 500ms | Existing section/card entrance animations |
| `--motion-duration-press` | 120ms | Immediate press feedback |
| `--motion-duration-instant` | 0ms | Visibility handoff and reduced-motion delay reset |

Curve: `--motion-easing: cubic-bezier(0.4, 0, 0.2, 1)`.
`--transition-fast` and `--transition-smooth` combine the control/surface role with
that curve. Use these tokens when adding a component; name each property explicitly.

Workshop entrance configuration uses generated aliases from the canonical theme.
LMS resolves the same tokens through its existing reveal-options reader. Existing
reveal offsets, thresholds and stagger roles remain. The engine releases completed
animation transforms so hover effects remain independent, and reveals occur once.

FAQ height and opacity animate in both directions. Mobile menus fade and slide in
both directions; closed content becomes inert immediately. A theme-based breakpoint
subscription retains enabled desktop links after resizing. Both behaviors preserve
their original expanded layout and focus management.

Player views fade in, including thumbnail restoration after completion or reset.
The previous stream is cancelled immediately on scroll-out or another activation.
Do not delay cancellation or keep a video mounted for an exit effect.

Reduced-motion mode disables entrance/player animations, reduces transition duration
and clears delays. It restores instant visibility and keeps all content usable.
No new runtime dependency, global scroll handler, perpetual transform animation or
blanket `transition: all` is required. Existing decorative pacing is unchanged.

Verification: `tests/site-motion.spec.ts` checks both websites against production
builds: numeric timing/curve values, actual native reveal durations, card transform
transition duration, menu opacity transitions in both directions, FAQ grid-height
transitions and reduced-motion cleanup. Existing workshop/LMS regression suites
cover layout, keyboard navigation, lifecycle ownership and playback cancellation.

The curve has a gradual start and finish so hover returns remain visible. The
hover tests measure intermediate transforms after entering and leaving, verify
return to zero, and exercise reversal before a hover completes. Native CSS may
shorten a reversed transition in proportion to the distance already travelled;
this avoids an exaggerated tail after a brief pointer gesture.

## Diagnosing missing motion in Windows Brave

The actual blocker found on 2026-10-09 was Windows' disabled client-area animation
setting. A clean Windows Brave instance reported reducedMotion=true with hover
and a fine pointer. On the live workshop, the computed card transition and marquee
animation were both `none`. Changing only the diagnostic tab's emulated preference
to no-preference immediately restored the 1s transform transition and marquee.
Earlier Linux headless tests did not inherit the Windows preference.

Evidence: `docs/evidence/site-motion/windows-animation-setting.json` and
`windows-brave-diagnosis.json`. To enable motion in the regular browser, Windows
Settings > Accessibility > Visual effects > Animation effects must be on, or
the user can explicitly override reduced motion in their own DevTools for testing.
System settings and existing browser profiles were not modified. Accessibility
behavior in the website remains intact. The temporary diagnostic browser was closed.

Creator marquee direction is now physically right-to-left. Its LTR track origin
preserves RTL chip contents. The endpoint subtracts half the total track width
plus half the gap, so duplicated sets line up at the loop boundary. Hover still
pauses the marquee as in the approved reference. `tests/reel-motion.spec.ts` checks
leftward movement, loop continuity and the exact reduced-motion failure/recovery.
