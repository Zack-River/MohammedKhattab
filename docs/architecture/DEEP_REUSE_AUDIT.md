# Deep reuse and ownership audit

Original review date: 2026-10-10. **R01–R12 are now resolved; the original findings below are retained as audit history.** See the resolution table and evidence. The original review was read-only; the subsequent authorized repairs changed implementations without redesigning the approved pages.

The original review found that the previous consolidation still left unjustified redundancy and reuse gaps. Those concrete findings are resolved below. The architecture guard passing alone does not establish behavioral parity or semantic reuse.


## Repair acceptance — 2026-10-10

All twelve findings were addressed. Full fresh-artifact suite: **151 passed**, zero failures/retries/skips. Main and isolated reuse-fixture builds passed. Production artifact `BUILD_ID`: `2TfiZPXdOfpOfFWe9nmAt`, served at `http://localhost:3040`. No packages were added. Existing approved copy, responsive layout, motion, media and route checks pass; lesson playback now intentionally uses the custom player.

| Finding | Resolution | Acceptance evidence |
| --- | --- | --- |
| R01 | Removed legacy embed hook; lessons compose DeferredVideoPlayer and viewport/session reset | `player-provider-parity`, existing LMS/media cases |
| R02 | Both adapters honor control/end/play policies and destroy replaced sessions | `player-provider-parity`, `youtube-player-helpers`, native lifecycle cases |
| R03 | One shared instructor/transformation/FAQ renderer; explicit context/reveal variants; eight old section/wrapper files removed | Real React `reuse-repairs` fixtures, reference/design and LMS reuse cases |
| R04 | Creator contacts/socials have one live owner; intentional portfolio variants named; JSON platform assertion removed | Typed canonical records, model identity and invalid action cases; original JSON retained for source provenance |
| R05 | Literal-match helper preserves absent/repeated/empty/single emphasis | Real React About round-trip cases |
| R06 | Actions carry icon/variant/external semantics; hero heading IDs derive from supplied section identity; menu IDs are instance-unique; header/footer targets supplied | Reordered action/two-hero/two-header SSR cases and browser header-target case |
| R07 | Focused commands/hooks; whole-workflow exclusion; decoded transport separated from server request helpers | Command failure ordering, malformed success payload, browser double-click/pending/retry and existing profile cases |
| R08 | Shared finite clamp validates native setters and SDK adapters | Real HTML media property assignments and SDK bounds cases |
| R09 | Removed data forwarding files/duplicate service exports; resolved canonical-target guard includes aliases and relative paths | Positive/negative guard mutations and clean architecture run |
| R10 | Existing numbering helper consumed by all three renderers | Consumer source checks and existing domain/UI formatting cases |
| R11 | Dead caption/upcoming-badge CSS removed from output and generator; unused captured literals pruned; dynamic/published semantic roles deliberately retained | Isolated regeneration equality, shared palette/radius/motion and reference cases |
| R12 | Superseded reference tools explicitly archived outside active scripts | Archived-tool documentation and removal assertions |

Caller-supplied section IDs must be unique within a document; header menu and FAQ control IDs are generated per instance. Contact variants and equal-valued theme roles are intentional contracts, not unowned copies. This acceptance closes the concrete audit findings; it does not assert that every future change or possible combination is defect-free.

Evidence: [validation](../evidence/reuse-repairs/validation.json), [full suite](../evidence/reuse-repairs/full-suite.log), [source changes](../evidence/reuse-repairs/source-changes.json). The original inventory/ledger below describe the pre-repair snapshot and are not current file hashes.

## Original review coverage and limits

The pre-report inventory contains **952 files**, including **344 production source/config/style files and 18,690 lines** under `app/`, `modules/`, `config/` and `packages/design-system/`. Production components, hooks, helpers, services, models, route adapters, types and data were reviewed for responsibility, dependencies and configurable contracts. Text scanning, import analysis, function inspection and CSS/token inspection supplement the review. Tooling and test coverage were inspected for obsolete paths and missing assertions.

The [file ledger](../evidence/deep-reuse-audit/FILE_LEDGER.md) enumerates production files with ownership and finding references. The [inventory](../evidence/deep-reuse-audit/inventory.json) also lists tests, tooling, documentation and assets, with hashes and text line counts. These are different review depths: inventorying a screenshot or a historical log is not a semantic code review. Generated font payloads, lockfiles and reference archives are not new handwritten implementations. Dependency installations, build output, Git internals, browser test output and symlinks are excluded; inspecting vendor code would not establish reuse in this application.

The exact-copy scan found no identical production executable files or function bodies over its comparison threshold. The route import graph found no unreachable production TS/TSX files. Both results are limited: near-identical markup is not an exact copy, and barrel exports can make unused exports appear reachable. Unused-export candidates were checked against actual consumers rather than deleted automatically.

## Original findings (resolved as above)

### R01 — High: lesson playback bypasses the canonical custom player

`modules/components/learning/lesson-player.tsx:22` uses `packages/design-system/hooks/use-video-embed.ts` and renders a raw iframe at line 26. The shared deferred/native/YouTube player has a separate lifecycle for custom controls and exclusive playback. The lesson iframe participates in neither the common reset policy nor managed player destruction.

The earlier browser probe on the current implementation observed `autoplay=1&playsinline=1`, zero `.custom-video-player` elements, and the iframe still mounted after a scroll event. The existing `tests/platform/lms.spec.ts` verifies iframe creation, allowing this second implementation to remain.

**Fix:** compose the lesson artwork/poster and lesson-specific copy around the shared player. Keep lesson identity and demo messaging in its model. Remove `use-video-embed` if no consumers remain.

**Acceptance:** native and YouTube lesson sources use the selected custom control policy; a second player resets the first; the agreed scroll reset removes the iframe/video source; disposal releases its session; poster and lesson copy remain unchanged. Test behavior, not merely iframe existence.

### R02 — High: one public player contract has different provider behavior

`packages/design-system/ui/deferred-video-player.tsx` accepts `controlsVariant` and `returnToPosterOnEnd`, but forwards them only to its native branch. Its YouTube branch forwards only `url`, `title` and `labels`. `ui/youtube-player.tsx` consequently uses the full-control default in `PlayerShell` and has no parent end/reset callback.

The deterministic active-branch probe in [contract-probes.json](../evidence/deep-reuse-audit/contract-probes.json) confirms the missing props. This is a component-contract probe with substituted hooks, not a YouTube playback/network test.

**Fix:** give both adapters equivalent control/end/play callbacks, or explicitly narrow unsupported options in a discriminated provider contract. Silent option loss is unacceptable. Preserve provider-specific SDK versus native media mechanics.

**Acceptance:** run the same overlay/full/end/poster/exclusive-playback assertions for both providers using the existing SDK stub. Verify `returnToPosterOnEnd=false` also retains the player, and cleanup destroys the SDK instance.

### R03 — Medium: three section implementations still have two owners

Workshop and LMS each implement `instructor-section.tsx`, `transformation-section.tsx` and `faq-section.tsx` under `app/components/workshop/` and `modules/components/marketing/`. Their main structure and content contract are substantially the same; differences are primarily context presentation and reveal attributes. The LMS instructor-photo/transformation-stage wrappers add reveal policy to already shared primitives.

**Fix:** share these section renderers with explicit context/reveal options and optional actions. Keep page compositions and content separate. Avoid a universal section component with unrelated booleans.

**Acceptance:** alternate content, missing optional eyebrow/action, multiple instances and both presentation variants render correctly. Approved workshop/LMS copy and reference screenshots must remain unchanged. The duplicated renderers and newly unnecessary wrappers should disappear.

### R04 — Medium: contact and social identity still has multiple owners

`app/config/site.ts:31` owns social destinations; `config/personal-portfolio.json` repeats them in `footer.socials`. TikTok and YouTube destinations match, while Facebook/Instagram destinations differ. The portfolio collaboration email is `contact@muhammedkhattab.com`; `config/identity.ts` owns `mohamedkhattab494@gmail.com`. These differences require an explicit model decision, not blind replacement. `modules/features/portfolio/page.tsx` also casts the JSON platform value to the social-platform type.

**Fix:** use a canonical creator-contact/social record with explicitly named intentional variants. Page models choose copy and presentation. Validate platform identifiers at the JSON/model boundary rather than asserting them with a cast. Retain the source archive as provenance.

**Acceptance:** every live footer/contact action resolves through that record; intentional email/profile variants are named and tested; invalid platform input is rejected before rendering. No approved destination changes silently.

### R05 — Medium: configurable portfolio About text can be corrupted

`modules/components/portfolio/about.tsx:8` destructures the first two results of `body.split(emphasis)`. Repeated emphasis drops later text; missing emphasis appends text that was never in the body. Current approved content happens to work.

**Fix:** use the existing rich-text contract or a focused helper that preserves all input text with a documented highlighting policy.

**Acceptance:** absent, repeated, empty and single emphasis all preserve text exactly. Actual React server rendering reproduced both failures; see `contract-probes.json`.

### R06 — Medium: action semantics and hero identity depend on position/literals

`modules/components/portfolio/actions.tsx` chooses primary styling and icons from array position and a collaboration flag. Reordering contact actions changes their meaning visually. `hero.tsx` exposes `content.id` but hardcodes `personal-title`; `modules/helpers/portfolio/update-header.ts` searches for `hero` directly. That creates inconsistent customization boundaries and duplicate IDs when reused twice.

**Fix:** model action variant/icon/external policy explicitly, retaining current defaults at composition. Derive the heading ID and header hero target from instance/model identity; pass the owned root/target into DOM helpers.

**Acceptance:** reorder actions without changing their icon/variant, render two heroes without duplicate IDs, and use a non-default hero ID while header state remains correct. Default appearance and navigation remain identical.

### R07 — Medium: workflow orchestration remains embedded in buttons

`modules/components/courses/enroll-button.tsx` coordinates enrollment and navigation; `modules/components/learning/completion-button.tsx` coordinates enrollment, progress and refresh. The enrollment operation is repeated. `modules/lib/api.ts` combines client response fetching with server request parsing/origin checks and trusts successful JSON via `data as T`.

**Fix:** extract focused enrollment/completion commands or hooks with required identity inputs and injected API/navigation dependencies where substitution is needed. Keep button rendering local. Separate client transport from server request helpers; validate successful response contracts. Do not introduce a repository/service hierarchy solely to wrap one function.

**Acceptance:** already-enrolled flow avoids enrollment; failed enrollment prevents progress/navigation; progress failure preserves existing state; double clicks cannot duplicate the complete workflow; malformed successful JSON is handled deliberately; UI tests cover pending/error/retry states. Request-level pending protection alone is not proof of whole-workflow protection.

### R08 — Medium: native and YouTube numeric contracts differ

`packages/design-system/helpers/media/native/seek.ts:3` validates duration but not requested time; `native/set-volume.ts` does not reject non-finite volume. The corresponding YouTube helpers reject non-finite requested values. An earlier real browser probe reproduced `TypeError` for native `NaN` seeks and volume.

**Fix:** share a finite/clamp policy where its meaning matches, while retaining native volume conversion and provider-specific seek operations. Define invalid-duration behavior as well.

**Acceptance:** both adapters handle `NaN`, infinities, negative and oversized inputs without uncaught exceptions or invalid state publication. Test actual media property assignments alongside SDK substitutes.

### R09 — Low: forwarding files and duplicate public exports escape the guard

`app/data/workshop/clients.ts` and `reviews.ts` only re-export root config. `app/data/workshop.ts` adds another wide export layer. `modules/features/catalog/service.ts` re-exports helpers already exposed through the feature index. The architecture forwarding rule specifically recognizes `@khatab/design` targets, missing the relative-config wrappers.

**Fix:** remove unnecessary data forwarding files, import canonical records at composition, and define a deliberate feature public surface. Resolve forwarding targets before applying the rule. Keep useful public-entry barrels; do not ban every re-export.

**Acceptance:** negative mutation cases detect comment-prefixed and relative/aliased forwarding-only modules to canonical owners; intentional feature indexes remain permitted; imports and public contracts still typecheck.

### R10 — Low: tested numbering helper is not used where repeated

`modules/features/catalog/helpers/numbered.ts` is used by its domain test, while the same zero-based numbering expression appears in course curriculum, lesson outline and hero preview renderers.

**Fix:** use the existing helper at these three sites, or remove it if deliberately keeping trivial formatting local. Do not merge duration formatting or statistic padding: they represent different inputs.

**Acceptance:** actual renderers use the chosen single policy and boundary cases retain `01`, `09`, `10`, `11`. Testing an unused helper is not sufficient.

### R11 — Low: obsolete CSS and token candidates remain

`modules/styles/portfolio.css:1412` still styles `.personal-work-caption`, although portfolio tests explicitly require those captions to be absent. `scripts/prepare-portfolio-styles.py` regenerates these rules, so CSS-only deletion would not remove their owner. It also emits a badge rule for upcoming cards whose renderer now uses ComingSoon instead.

The token scan lists duplicate literal groups and apparently unused tokens in [css-audit.json](../evidence/deep-reuse-audit/css-audit.json). Equal values do **not** imply equal design roles. Candidates are not proven dead: dynamic token construction, generation and documented external contracts must be checked first. `--workshop-reveal-viewport`, for example, is accessed through a generated token name and must not be deleted using a literal-reference scan.

**Fix:** remove proven obsolete rules at both generator and output; review unused candidates; alias semantically equivalent constants to existing roles while preserving reference-specific geometry and product variants.

**Acceptance:** regenerate in an isolated fixture and compare with checked-in output; no removed captions/badges reappear; shared theme substitutions still reach all three pages; screenshot, motion and reduced-motion checks pass.

### R12 — Low: a historical comparison tool points to removed inputs

`scripts/compare-reference.cjs:7` reads `content/reference/workshop.css` and `.html`; that directory does not exist in this workspace. `scripts/prepare-reference.py` still creates `content/workshop.html` and contains old contact/media substitutions. These are reference-preparation tools, not live UI, but their status and inputs are unclear.

**Fix:** either archive explicitly superseded tools with their provenance or update them to the current reference archive and configurable inputs. Avoid maintaining historical hardcoded copies as if they were production identity owners.

**Acceptance:** every documented active tool can locate its inputs on a clean checkout; historical tools are clearly labelled and absent from current build/test instructions; isolated regeneration does not change unrelated theme sections.

## Deliberately retained boundaries

- Next route files remain adapters; workshop, LMS and portfolio compositions/content models remain distinct.
- Different hero/header/footer layouts and icon vocabularies preserve the approved references. Sharing names or HTML tags alone does not justify merging them.
- Native and YouTube lifecycle adapters remain separate because their platform mechanics differ; their public behavior must agree where the contract agrees.
- Shared sibling-native pause and exclusive managed-player reset serve different purposes: one handles unmanaged native elements, the other restores managed posters and releases sources.
- Pure domain helpers and server-backed services remain separate. Demo learning data and persistence remain intentionally demo scope.
- Theme import entries, generated server token/font payloads and isolated reuse fixtures are purposeful boundaries, not duplicate installations or independent production websites.
- Small scalar helpers and cohesive internal lifecycle operations do not need options objects merely because they have several arguments. The five positional-contract candidates are inventoried, not automatically flagged as violations.

## Original review verification (historical)

Fresh checks: architecture **335 files / zero rule violations**; TypeScript passed; reproduction snapshot **412 source files verified**; lint passed. Source/contract probes reproduce R02 and R05. Earlier browser probes reproduce R01 and R08; their observations are recorded above, and are not represented as a new full browser run on 2026-10-10.

The previous full suite had **138 passes** against build `blmGjDpltv87wO56bTZWc`; its evidence remains in `docs/evidence/shared-consolidation/validation.json`. That historical success is not acceptance of these new cases. No build or full browser suite was rerun for this documentation-only audit. R01–R12 remain open; no claim of complete reuse acceptance is made.

Recommended repair order: provider/lesson behavior and text integrity (R01, R02, R05, R08), then shared sections and explicit customization/identity/workflow contracts (R03, R04, R06, R07), then forwarding/formatting/style/tool cleanup (R09–R12). Each change must pass its new behavioral cases plus existing reference/design/architecture checks before being marked complete.
