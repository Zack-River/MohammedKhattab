# Scoped LMS routes — 2026-10-09

Build `Vn8cpWL5dPrRrgsoYLEdF`.

- Main pages: `/`, `/ta3allam`, `/7days-freelance`.
- LMS UI is entirely under `/ta3allam/*`; catalog at `/ta3allam/courses`.
- Old `/ta3llam/*` and root learning routes redirect with nested paths and query filters preserved.
- Root lint, TypeScript and Next.js build passed; architecture guard: 294 files, zero violations.
- Unified routing/architecture tests: eight passed.
- Domain/LMS/media tests: 30 passed.
- One app/build is served at 3040, with 3022/3042 compatibility previews.
