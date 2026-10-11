import { projectRoutes } from "./project-navigation";
import source from "./personal-portfolio.json";
import { creatorContacts } from "./creator-contacts";
import { readPortfolioAction } from "../modules/helpers/portfolio/read-action";
import type { PortfolioContent } from "../modules/types/portfolio";
/** JSON preserves reference copy/provenance; live identity destinations have canonical owners. */
export const personalPortfolio: PortfolioContent = {
  ...source,
  header: { ...source.header, navigation: source.header.navigation.filter(link => link.href !== `#${source.courses.id}`) },
  courses: { ...source.courses, items: source.courses.items.map(item => ({ ...item, href: item.href === "/7days-freelance" ? projectRoutes.workshop : item.href })) },
  hero: { ...source.hero, actions: source.hero.actions.map(readPortfolioAction) },
  collaboration: { ...source.collaboration, actions: source.collaboration.actions.map((action) =>
    readPortfolioAction({ ...action, href: action.icon === "whatsapp" ? creatorContacts.whatsapp : creatorContacts.portfolioEmail })) },
};
