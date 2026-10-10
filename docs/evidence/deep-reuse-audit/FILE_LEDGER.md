# Production file review ledger

Date: 2026-10-10. Inventory captured before audit documents were added.

344 production files. Every entry has a hash in inventory.json. Responsibilities describe the reviewed boundary, not a guarantee that an unlisted defect cannot exist. “No specific finding” means this audit did not identify a concrete reuse gap in that file. CSS and generated payloads use the review depth shown below; historical/binary/test/tool files are enumerated separately in inventory.json.

| File | Lines | Responsibility/review | Finding |
| --- | ---: | --- | --- |
| `app/7days-freelance/page.tsx` | 8 | Next route/composition or route-state boundary | No specific finding |
| `app/api/certificates/[slug]/route.ts` | 46 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/courses/[slug]/route.ts` | 13 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/courses/route.ts` | 11 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/enrollments/route.ts` | 31 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/profile/route.ts` | 26 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/progress/route.ts` | 42 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/api/resources/[id]/route.ts` | 18 | Next API adapter; parsing/service/response boundary | No specific finding |
| `app/components/workshop/discount-countdown.tsx` | 46 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/faq-section.tsx` | 17 | Renderer; content contracts and reuse reviewed | R03 |
| `app/components/workshop/final-cta-section.tsx` | 36 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/guarantee-section.tsx` | 38 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/hero-section.tsx` | 31 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/index.ts` | 11 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/instructor-section.tsx` | 41 | Renderer; content contracts and reuse reviewed | R03 |
| `app/components/workshop/recent-signup-toast.tsx` | 42 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/roadmap-day.tsx` | 49 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/roadmap-formula.tsx` | 30 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/roadmap-section.tsx` | 33 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/roadmap-timeline.tsx` | 35 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/scarcity-bar.tsx` | 38 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/site-footer.tsx` | 30 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/site-header.tsx` | 31 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/site-navigation.tsx` | 71 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/transformation-section.tsx` | 38 | Renderer; content contracts and reuse reviewed | R03 |
| `app/components/workshop/workshop-content.tsx` | 19 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/components/workshop/workshop-page.tsx` | 44 | Renderer; content contracts and reuse reviewed | No specific finding |
| `app/config/offer.ts` | 9 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/config/reference-motion.ts` | 90 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/config/reference-ui.ts` | 9 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/config/site.ts` | 59 | Content/config ownership; variants distinguished from facts | R04 |
| `app/config/workshop-metadata.ts` | 36 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/data/workshop.ts` | 7 | Content/config ownership; variants distinguished from facts | R09 |
| `app/data/workshop/clients.ts` | 2 | Content/config ownership; variants distinguished from facts | R09 |
| `app/data/workshop/content.ts` | 258 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/data/workshop/curriculum.ts` | 95 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/data/workshop/faq.ts` | 38 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/data/workshop/reviews.ts` | 2 | Content/config ownership; variants distinguished from facts | R09 |
| `app/data/workshop/signup.ts` | 23 | Content/config ownership; variants distinguished from facts | No specific finding |
| `app/error.tsx` | 16 | Next route/composition or route-state boundary | No specific finding |
| `app/globals.css` | 11 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `app/helpers/navigation/align-inner-corridor.ts` | 16 | Focused operation; purity/DOM ownership checked | No specific finding |
| `app/helpers/roadmap/read-geometry.ts` | 15 | Focused operation; purity/DOM ownership checked | No specific finding |
| `app/helpers/roadmap/read-options.ts` | 9 | Focused operation; purity/DOM ownership checked | No specific finding |
| `app/helpers/roadmap/update-progress.ts` | 15 | Focused operation; purity/DOM ownership checked | No specific finding |
| `app/hooks/use-discount-countdown.ts` | 36 | React lifecycle/state coordination | No specific finding |
| `app/hooks/use-inner-corridor.ts` | 32 | React lifecycle/state coordination | No specific finding |
| `app/hooks/use-mobile-navigation.ts` | 12 | React lifecycle/state coordination | No specific finding |
| `app/hooks/use-reference-signup.ts` | 28 | React lifecycle/state coordination | No specific finding |
| `app/hooks/use-roadmap-progress.ts` | 33 | React lifecycle/state coordination | No specific finding |
| `app/layout.tsx` | 21 | Next route/composition or route-state boundary | No specific finding |
| `app/lib/countdown.ts` | 44 | Shared/feature service utility boundary | No specific finding |
| `app/lib/timeline.ts` | 4 | Shared/feature service utility boundary | No specific finding |
| `app/loading.tsx` | 18 | Next route/composition or route-state boundary | No specific finding |
| `app/not-found.tsx` | 23 | Next route/composition or route-state boundary | No specific finding |
| `app/page.tsx` | 9 | Next route/composition or route-state boundary | No specific finding |
| `app/styles/theme-server.json` | 30 | Generated server projection of CSS tokens | No specific finding |
| `app/styles/theme.css` | 2 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `app/ta3allam/(public)/courses/[slug]/page.tsx` | 82 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/(public)/courses/page.tsx` | 67 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/(public)/layout.tsx` | 42 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/(public)/login/page.tsx` | 45 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/certificates/page.tsx` | 51 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/courses/page.tsx` | 52 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/layout.tsx` | 39 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/page.tsx` | 100 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/profile/page.tsx` | 45 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/dashboard/resources/page.tsx` | 26 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/learn/[slug]/[lessonId]/page.tsx` | 35 | Next route/composition or route-state boundary | No specific finding |
| `app/ta3allam/page.tsx` | 11 | Next route/composition or route-state boundary | No specific finding |
| `config/creator-media.ts` | 25 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/designer.ts` | 6 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/fonts.ts` | 6 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/identity.ts` | 14 | Content/config ownership; variants distinguished from facts | R04 |
| `config/marketing-intro.ts` | 21 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/marketing-proof.ts` | 48 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/personal-portfolio.json` | 242 | Content/config ownership; variants distinguished from facts | R04 |
| `config/portfolio-media.json` | 45 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/portfolio-youtube.json` | 57 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/portfolio.ts` | 48 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/project-navigation.ts` | 17 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/student-reviews.ts` | 104 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/workshop-clients.ts` | 108 | Content/config ownership; variants distinguished from facts | No specific finding |
| `config/workshop-intro-media.json` | 10 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/components/account/profile-form.tsx` | 80 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/certificates/certificate-card.tsx` | 35 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/artwork/business.tsx` | 35 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/artwork/design.tsx` | 35 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/artwork/helpers/validate-kind.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/components/courses/artwork/illustration.tsx` | 11 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/artwork/motion.tsx` | 40 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/artwork/timeline.tsx` | 52 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/catalog-filters.tsx` | 49 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-artwork.tsx` | 51 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-card.tsx` | 92 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-grid.tsx` | 51 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-outcomes.tsx` | 24 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-overview.tsx` | 39 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/course-price.tsx` | 26 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/courses/curriculum.tsx` | 47 | Renderer; content contracts and reuse reviewed | R10 |
| `modules/components/courses/enroll-button.tsx` | 63 | Renderer; content contracts and reuse reviewed | R07 |
| `modules/components/courses/enrollment-panel.tsx` | 80 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/brand.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/dashboard-header.tsx` | 36 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/dashboard-shell.tsx` | 31 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/dashboard-sidebar.tsx` | 48 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/site-footer.tsx` | 60 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/layout/site-header.tsx` | 92 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/completion-button.tsx` | 67 | Renderer; content contracts and reuse reviewed | R07 |
| `modules/components/learning/continue-card.tsx` | 57 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/dashboard-stats.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/learning-header.tsx` | 24 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/lesson-actions.tsx` | 50 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/lesson-information.tsx` | 65 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/lesson-notes.tsx` | 33 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/learning/lesson-outline.tsx` | 68 | Renderer; content contracts and reuse reviewed | R10 |
| `modules/components/learning/lesson-player.tsx` | 58 | Renderer; content contracts and reuse reviewed | R01 |
| `modules/components/learning/lesson-title.tsx` | 34 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/closing-section.tsx` | 42 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/coaching-section.tsx` | 40 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/course-showcase.tsx` | 66 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/faq-section.tsx` | 21 | Renderer; content contracts and reuse reviewed | R03 |
| `modules/components/marketing/hero-preview.tsx` | 44 | Renderer; content contracts and reuse reviewed | R10 |
| `modules/components/marketing/instructor-photo.tsx` | 8 | Renderer; content contracts and reuse reviewed | R03 |
| `modules/components/marketing/instructor-section.tsx` | 42 | Renderer; content contracts and reuse reviewed | R03 |
| `modules/components/marketing/landing-hero.tsx` | 70 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/landing-page.tsx` | 79 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/reveal-content.tsx` | 28 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/skill-strip.tsx` | 21 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/marketing/transformation-section.tsx` | 39 | Renderer; content contracts and reuse reviewed | R03 |
| `modules/components/marketing/transformation-stage.tsx` | 6 | Renderer; content contracts and reuse reviewed | R03 |
| `modules/components/portfolio/about.tsx` | 45 | Renderer; content contracts and reuse reviewed | R05 |
| `modules/components/portfolio/actions.tsx` | 38 | Renderer; content contracts and reuse reviewed | R06 |
| `modules/components/portfolio/clients.tsx` | 29 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/collaboration.tsx` | 27 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/courses.tsx` | 57 | Renderer; content contracts and reuse reviewed | R06 |
| `modules/components/portfolio/footer.tsx` | 59 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/header.tsx` | 68 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/hero.tsx` | 51 | Renderer; content contracts and reuse reviewed | R06 |
| `modules/components/portfolio/icon.tsx` | 40 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/journey.tsx` | 46 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/section.tsx` | 39 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/portfolio/work.tsx` | 40 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/resources/resource-card.tsx` | 29 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/ui/empty-state.tsx` | 27 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/ui/page-heading.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/ui/progress-bar.tsx` | 38 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/ui/section-heading.tsx` | 6 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/components/ui/symbol.tsx` | 41 | Renderer; content contracts and reuse reviewed | No specific finding |
| `modules/config/catalog.ts` | 16 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/config/navigation.ts` | 49 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/config/persistence.ts` | 9 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/catalog-settings.ts` | 21 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/courses.ts` | 343 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/demo-learning.ts` | 11 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/interface-copy.ts` | 112 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/offers.ts` | 21 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/resources.ts` | 28 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/data/site.ts` | 201 | Content/config ownership; variants distinguished from facts | No specific finding |
| `modules/features/catalog/helpers/course-lessons.ts` | 4 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/course-seconds.ts` | 8 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/find-lesson.ts` | 5 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/format-course-duration.ts` | 13 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/index.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/lesson-key.ts` | 3 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/numbered.ts` | 3 | Focused operation; purity/DOM ownership checked | R10 |
| `modules/features/catalog/helpers/parse-lesson-time.ts` | 9 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/select-courses.ts` | 12 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/select-preview.ts` | 19 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/validate-catalog.ts` | 12 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/validate-course.ts` | 13 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/helpers/validate-lessons.ts` | 15 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/catalog/index.ts` | 3 | Feature composition/domain/server boundary | R09 |
| `modules/features/catalog/service.ts` | 23 | Feature composition/domain/server boundary | R09 |
| `modules/features/certificates/presentation.ts` | 9 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/certificates/renderer.ts` | 31 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/helpers/complete-lesson.ts` | 12 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/course-progress.ts` | 22 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/dashboard-stats.ts` | 29 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/enroll.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/index.ts` | 4 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/lesson-outline.ts` | 26 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/helpers/valid-ids.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/features/learning/index.ts` | 4 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/models/lesson-information.ts` | 13 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/models/lesson-playback.ts` | 16 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/models/lesson-shell.ts` | 15 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/read-lesson-context.ts` | 20 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/sanitize.ts` | 26 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/learning/service.ts` | 26 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/index.ts` | 2 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/landing.tsx` | 37 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/closing.ts` | 13 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/coaching-benefits.ts` | 25 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/coaching-content.ts` | 19 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/coaching.ts` | 8 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/courses.ts` | 30 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/footer.ts` | 21 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/header.ts` | 15 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/marketing/models/hero.ts` | 32 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/portfolio/index.ts` | 2 | Feature composition/domain/server boundary | No specific finding |
| `modules/features/portfolio/page.tsx` | 54 | Feature composition/domain/server boundary | R04 |
| `modules/features/profile/validation.ts` | 23 | Feature composition/domain/server boundary | No specific finding |
| `modules/helpers/portfolio/navigation-root-margin.ts` | 7 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/helpers/portfolio/observe-active-section.ts` | 14 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/helpers/portfolio/update-header.ts` | 8 | Focused operation; purity/DOM ownership checked | R06 |
| `modules/helpers/portfolio/update-timeline.ts` | 9 | Focused operation; purity/DOM ownership checked | No specific finding |
| `modules/hooks/portfolio/use-active-section.ts` | 21 | React lifecycle/state coordination | No specific finding |
| `modules/hooks/portfolio/use-portfolio-header.ts` | 20 | React lifecycle/state coordination | No specific finding |
| `modules/hooks/portfolio/use-portfolio-navigation.ts` | 17 | React lifecycle/state coordination | No specific finding |
| `modules/hooks/portfolio/use-timeline-progress.ts` | 25 | React lifecycle/state coordination | No specific finding |
| `modules/hooks/use-api-mutation.ts` | 26 | React lifecycle/state coordination | R07 |
| `modules/hooks/use-lesson-notes.ts` | 33 | React lifecycle/state coordination | No specific finding |
| `modules/hooks/use-profile-submission.ts` | 36 | React lifecycle/state coordination | No specific finding |
| `modules/lib/api.ts` | 40 | Shared/feature service utility boundary | R07 |
| `modules/lib/theme.ts` | 3 | Shared/feature service utility boundary | No specific finding |
| `modules/styles/certificate-font.json` | 2 | Generated export payload; single baked font source | No specific finding |
| `modules/styles/lms.css` | 2082 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `modules/styles/portfolio.css` | 1464 | Stylesheet ownership; structural/token scan, targeted semantic review | R11 |
| `modules/styles/theme-server.json` | 7 | Generated server projection of CSS tokens | No specific finding |
| `modules/styles/theme.css` | 48 | Stylesheet ownership; structural/token scan, targeted semantic review | R11 |
| `modules/types/content.ts` | 12 | Type contract; domain/UI shape | No specific finding |
| `modules/types/dashboard-shell.ts` | 22 | Type contract; domain/UI shape | No specific finding |
| `modules/types/landing-hero.ts` | 29 | Type contract; domain/UI shape | No specific finding |
| `modules/types/lms.ts` | 56 | Type contract; domain/UI shape | No specific finding |
| `modules/types/portfolio.ts` | 8 | Type contract; domain/UI shape | R06 |
| `packages/design-system/config/player.ts` | 2 | Content/config ownership; variants distinguished from facts | No specific finding |
| `packages/design-system/config/youtube-player.ts` | 9 | Content/config ownership; variants distinguished from facts | No specific finding |
| `packages/design-system/helpers/browser/animation-frame.ts` | 16 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/appearance.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/format-time.ts` | 10 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/initial-snapshot.ts` | 7 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/pause-other-videos.ts` | 7 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/play.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/read-snapshot.ts` | 13 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/release-source.ts` | 7 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/retry.ts` | 8 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/seek.ts` | 9 | Focused operation; purity/DOM ownership checked | R08 |
| `packages/design-system/helpers/media/native/set-volume.ts` | 6 | Focused operation; purity/DOM ownership checked | R08 |
| `packages/design-system/helpers/media/native/subscribe.ts` | 33 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/toggle-mute.ts` | 4 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/native/toggle.ts` | 10 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/playback-action.ts` | 22 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/player-keyboard.ts` | 21 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/controlled-url.ts` | 20 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/events.ts` | 19 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/fail.ts` | 9 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/iframe.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/load-api.ts` | 14 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/mount.ts` | 33 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/polling.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/read-time.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/ready.ts` | 14 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/request-api.ts` | 35 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/sample.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/seek.ts` | 9 | Focused operation; purity/DOM ownership checked | R08 |
| `packages/design-system/helpers/media/youtube/session.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/set-volume.ts` | 11 | Focused operation; purity/DOM ownership checked | R08 |
| `packages/design-system/helpers/media/youtube/state-change.ts` | 13 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/toggle-mute.ts` | 12 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/media/youtube/toggle.ts` | 10 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/create-entrance.ts` | 10 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/dispose-reveals.ts` | 11 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/observe-reveals.ts` | 20 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/register-reveal-target.ts` | 23 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/register-reveals.ts` | 17 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/reveal-ownership.ts` | 21 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/reveal-session.ts` | 18 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/update-reveal-children.ts` | 12 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/motion/update-reveal-preference.ts` | 15 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/navigation/subscribe-dismissal.ts` | 29 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/theme/parse-number.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/theme/parse-time.ts` | 6 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/helpers/theme/read-reveal-options.ts` | 32 | Focused operation; purity/DOM ownership checked | No specific finding |
| `packages/design-system/hooks/use-accordion.ts` | 11 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-below-breakpoint.ts` | 16 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-exclusive-player.ts` | 20 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-media-player-session.ts` | 17 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-menu-dismissal.ts` | 26 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-mobile-menu.ts` | 16 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-native-video-player.ts` | 26 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-player-fullscreen.ts` | 38 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-player-viewport-reset.ts` | 24 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-scroll-reveals.ts` | 20 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/hooks/use-video-embed.ts` | 15 | React lifecycle/state coordination | R01 |
| `packages/design-system/hooks/use-youtube-player.ts` | 30 | React lifecycle/state coordination | No specific finding |
| `packages/design-system/lib/player-labels.ts` | 17 | Shared/feature service utility boundary | No specific finding |
| `packages/design-system/lib/scroll-reveals.ts` | 30 | Shared/feature service utility boundary | No specific finding |
| `packages/design-system/lib/theme.cjs` | 25 | Shared/feature service utility boundary | No specific finding |
| `packages/design-system/lib/video.ts` | 26 | Shared/feature service utility boundary | No specific finding |
| `packages/design-system/package.json` | 20 | Package/export/configuration boundary | No specific finding |
| `packages/design-system/styles/coming-soon.css` | 82 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/styles/designer-credit.css` | 11 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/styles/fonts.css` | 29 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/styles/project-navigation.css` | 19 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/styles/theme.css` | 584 | Stylesheet ownership; structural/token scan, targeted semantic review | R11 |
| `packages/design-system/styles/video-player.css` | 440 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/styles/workshop.css` | 3159 | Stylesheet ownership; structural/token scan, targeted semantic review | No specific finding |
| `packages/design-system/types/interactions.ts` | 41 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/marketing.ts` | 151 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/media-player.ts` | 28 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/project-navigation.ts` | 5 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/ui.ts` | 61 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/video-player.ts` | 75 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/types/workshop.ts` | 27 | Type contract; domain/UI shape | No specific finding |
| `packages/design-system/ui/action-link.tsx` | 36 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/action.tsx` | 34 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/asset-image.tsx` | 22 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/author-identity.tsx` | 44 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/clients-section.tsx` | 34 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/coming-soon.tsx` | 46 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/container.tsx` | 14 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/creator-chip.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/creator-marquee.tsx` | 27 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/deferred-video-player.tsx` | 86 | Renderer; content contracts and reuse reviewed | R02 |
| `packages/design-system/ui/designer-credit.tsx` | 11 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/eyebrow.tsx` | 22 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/faq-accordion.tsx` | 32 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/faq-item.tsx` | 45 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/featured-review.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/font-preloads.tsx` | 14 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/hero-video.tsx` | 59 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/instructor-photo.tsx` | 24 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/instructor-stats.tsx` | 26 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/media-player.tsx` | 85 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/microcopy.tsx` | 28 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/native-video-player.tsx` | 52 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/player-icon.tsx` | 29 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/player-shell.tsx` | 92 | Renderer; content contracts and reuse reviewed | R02 |
| `packages/design-system/ui/project-navigation.tsx` | 17 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/reel-card.tsx` | 40 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/review-card.tsx` | 14 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/review-list.tsx` | 30 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/rich-text.tsx` | 23 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/section-heading.tsx` | 45 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/section.tsx` | 14 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/social-icon.tsx` | 52 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/social-links.tsx` | 32 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/testimonials-section.tsx` | 38 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/transformation-stage.tsx` | 17 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/ui-icon.tsx` | 60 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/video-controls.tsx` | 81 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/video-volume-controls.tsx` | 21 | Renderer; content contracts and reuse reviewed | No specific finding |
| `packages/design-system/ui/youtube-player.tsx` | 23 | Renderer; content contracts and reuse reviewed | R02 |

## Tooling findings

- `scripts/architecture-boundaries.cjs`: R09; alias/relative canonical-owner forwarding is not fully covered.
- `scripts/prepare-portfolio-styles.py`: R11; regenerates obsolete caption rules.
- `scripts/compare-reference.cjs`, `scripts/prepare-reference.py`: R12; legacy inputs/output paths.

## Coverage evidence

Inventory includes every non-excluded file. Tests were reviewed for behavior coverage around findings; no claim is made that all test files were rerun. Existing architecture/size gates and prior complete browser acceptance are complementary evidence, not proof of zero semantic duplication.
