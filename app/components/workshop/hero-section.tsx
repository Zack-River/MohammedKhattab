import Container from "@khatab/design/ui/container";
import ActionLink from "@khatab/design/ui/action-link";
import Microcopy from "@khatab/design/ui/microcopy";
import RichText from "@khatab/design/ui/rich-text";
import Section from "@khatab/design/ui/section";
import HeroVideo from "@khatab/design/ui/hero-video";
import type { HeroContent } from "@khatab/design/types/marketing";

export default function HeroSection({ content }: { content: HeroContent }) {
  return (
    <Section {...content.section}>
      <div className="hero-interactive-grid" aria-hidden="true" />
      <Container>
        <div className="hero-inner-content">
          <h1 className="headline-h1 hero-headline">
            <RichText content={content.title} />
          </h1>
          <p className="hero-support-text">{content.description}</p>
          {content.showVideo !== false && <div className="hero-video-centered">
            <HeroVideo content={content.video} />
          </div>}
          <div className="hero-cta-wrapper">
            <ActionLink action={content.action} />
            <Microcopy items={content.microcopy} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
