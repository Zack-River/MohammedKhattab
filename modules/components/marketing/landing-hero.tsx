import HeroVideo from "@khatab/design/ui/hero-video";
import type { LandingHeroProps } from "@platform/types/landing-hero";
import { routes } from "@platform/config/navigation";

import Link from "next/link";
import Container from "@khatab/design/ui/container";
import Microcopy from "@khatab/design/ui/microcopy";
import Icon from "@khatab/design/ui/ui-icon";
import HeroPreview from "./hero-preview";
import Symbol from "@platform/components/ui/symbol";
export default function LandingHero({
  interfaceCopy,
  preview,
  video,
  artworkLessonLabel,
  site,
  actions = { browse: routes.courses, dashboard: routes.dashboard },
}: LandingHeroProps) {
  return (
    <section className="hero-section lms-landing-hero">
      <div className="hero-interactive-grid" aria-hidden="true" />
      <Container>
        <div className="hero-inner-content" data-reveal-group="hero">
          <h1 className="headline-h1 hero-headline" data-reveal>
            {interfaceCopy.heroLead}
            <br />
            {interfaceCopy.heroSkillLead}{" "}
            <span className="highlight-editors">
              <Icon
                name="sparkle"
                className="badge-sparkle-icon"
                width="18"
                height="18"
                fill="currentColor"
              />
              {interfaceCopy.heroHighlight}
            </span>
          </h1>
          <p className="hero-support-text" data-reveal>
            {interfaceCopy.heroDescription}
            <br />
            {interfaceCopy.heroSupport}
          </p>
          <div className="lms-hero-actions" data-reveal>
            <Link href={actions.browse} className="btn-primary">
              {interfaceCopy.heroBrowseAction}
              <Symbol name="arrow" />
            </Link>
            <Link href={actions.dashboard} className="lms-secondary-button">
              <Symbol name="play" />
              {interfaceCopy.heroDashboardAction}
            </Link>
          </div>
          <Microcopy
            reveal
            items={[
              interfaceCopy.heroBeginnerNote,
              interfaceCopy.heroScheduleNote,
              interfaceCopy.heroPracticeNote,
            ]}
          />
          {video ? <div className="lms-hero-video" data-reveal><HeroVideo content={video} /></div> : preview && (
            <HeroPreview interfaceCopy={interfaceCopy} preview={preview} artworkLessonLabel={artworkLessonLabel} site={site} actions={actions} />
          )}
        </div>
      </Container>
    </section>
  );
}
