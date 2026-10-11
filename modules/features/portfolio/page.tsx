import { designerCredit } from "../../../config/designer";
import { projectNavigation } from "../../../config/project-navigation";
import { personalPortfolio as content } from "../../../config/personal-portfolio-model";
import { portfolioSocials } from "../../../config/creator-contacts";
import { creators, clientReels } from "../../../config/workshop-clients";
import RevealContent from "@platform/components/marketing/reveal-content";
import Header from "@platform/components/portfolio/header";
import Hero from "@platform/components/portfolio/hero";
import About from "@platform/components/portfolio/about";
import Journey from "@platform/components/portfolio/journey";
import Clients from "@platform/components/portfolio/clients";
import Work from "@platform/components/portfolio/work";
import Courses from "@platform/components/portfolio/courses";
import Collaboration from "@platform/components/portfolio/collaboration";
import Footer from "@platform/components/portfolio/footer";
const sectionIds = [
  content.hero.id,
  ...content.header.navigation.filter(link => link.href.startsWith("#")).map((link) => link.href.slice(1)),
  content.collaboration.id,
];
export default function PortfolioPage() {
  return (
    <div className="personal-site">
      <div className="p-ref-ambient-glow" aria-hidden="true" />
      <a className="personal-skip" href={`#${content.accessibility.mainId}`}>
        {content.accessibility.skipLabel}
      </a>
      <Header heroId={content.hero.id} content={content.header} sectionIds={sectionIds} />
      <RevealContent as="div">
        <main id={content.accessibility.mainId}>
          <Hero content={content.hero} />
          <About content={content.about} />
          <Journey content={content.journey} />
          <Clients content={content.clients} clients={creators} />
          <Work
            content={content.work}
            samples={clientReels}
          />
          <Courses content={content.courses} />
          <Collaboration content={content.collaboration} />
        </main>
        <Footer homeHref={content.header.homeHref} credit={designerCredit} content={content.footer} socials={portfolioSocials} projectNavigation={projectNavigation} />
      </RevealContent>
    </div>
  );
}
