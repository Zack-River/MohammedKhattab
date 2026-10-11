import type { Metadata } from "next";
import { PortfolioPage } from "@platform/features/portfolio";
import content from "@/config/personal-portfolio.json";
export const metadata: Metadata = {
  title: { absolute: content.metadataTitle },
  description: content.hero.description,
};
export default PortfolioPage;
