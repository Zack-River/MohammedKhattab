> Historical evidence for the superseded journey/player redesign. The current reference reconstruction is documented in `DESIGN_SYSTEM.md`; these results do not measure its performance.

# Your first edit — UX direction

Purpose: help a student imagine making their first video, understand the practical workshop and choose whether to contact Mohammed. The story earns the next scroll by answering a small question and opening the next one. Navigation, reading and leaving always remain under the visitor's control.

Tone: playful editorial, like a student's notebook meeting an editing desk. Charcoal, warm paper and one red accent. IBM Plex Arabic stays readable; oversized Arabic headings, numbered chapter seams and a recurring film-strip graphic carry the identity. Design feasibility score: 13 (impact 5, audience fit 5, feasibility 4, performance 4, consistency risk 5 across the full redesign; the practical implementation limits simultaneous motion).

## Storyboard before implementation

| Chapter         | Visitor's question               | Visual and interaction                                                                                                                                 | What earns the next scroll                                                  |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| Start           | Can I really do this?            | An asymmetric hero: huge plain Arabic, real video preview and a handwritten seven-day marker. No loading curtain.                                      | “Let's see how one idea becomes a video.”                                   |
| See the process | What does editing actually mean? | A sticky editing desk assembles one illustrative clip across three readable beats. A single GSAP timeline moves frames, captions and audio into place. | The visitor sees a result and wants to try one decision.                    |
| Try it          | Can I spot the difference?       | A small before/after interaction with Motion mini transitions and visible controls; real creator portraits establish context.                          | “Now, how do I learn to do that?”                                           |
| Make it         | What will I do each day?         | A warm-paper seven-day chapter with generous day numbers and clear practical milestones. Full lesson information stays available.                      | Small milestones build confidence; the next section introduces the teacher. |
| Meet your guide | Who will help me?                | Real portrait, conversational copy, readable stats and a curated quote composition. More reviews remain available.                                     | FAQ resolves the visitor's remaining practical questions.                   |
| Finish          | What is my next step?            | A full red closing page echoes the opening line and explicitly celebrates reaching the end. One clear contact action.                                  | A natural ending, rather than another endless list.                         |

## Motion and runtime ownership

- Native document scrolling. Sticky layout is CSS, not a page-sized JS pin/spacer.
- GSAP choreographs the single desktop editing-desk story, prepared one viewport ahead. Scrub only transform/opacity, and read geometry during refresh rather than on each animation frame.
- Motion mini animates the before/after interaction on demand, via the native Web Animations API. It does not own GSAP targets or load the full React engine.
- One shared IntersectionObserver handles simple entrances; another handles chapter milestones. No broad page ResizeObserver repeatedly refreshing every GSAP target.
- No animated box-shadow loops, pointer-parallax grid, expensive full-page blur or per-frame React state.
- Mobile and reduced-motion versions remain complete and legible; no text depends on animation to become available. Arabic words are never split into individual characters.

## Research applied

- [Official GSAP skills](https://github.com/greensock/gsap-skills): timeline labels, scoped React cleanup, transform/opacity, cached measurements and deliberate refresh.
- [Motion skill](https://github.com/oakoss/agent-skills/tree/main/skills/motion): scoped interactions, reduced motion and choosing the smallest animation engine.
- [Motion animate documentation](https://motion.dev/docs/animate): dynamically loaded `motion/mini`, native browser animation controls.
- [Motion performance guide](https://motion.dev/docs/performance): avoid layout-heavy animation and unnecessary rendering work.

## Validation

Compare fixed-duration production scroll profiling before and after, including CPU-throttled runs. Report local measurements with their limits, rather than claiming a field-performance score. Verify live preference changes, direct anchors, keyboard browsing, gallery interaction, roadmap hover/active relationships, video, FAQ, 320px overflow and the final chapter.
