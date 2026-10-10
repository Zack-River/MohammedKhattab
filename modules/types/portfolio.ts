import type source from "../../config/personal-portfolio.json";
export type PortfolioContent = Omit<typeof source, "hero" | "collaboration"> & {
  hero: Omit<typeof source.hero, "actions"> & { actions: readonly PortfolioAction[] };
  collaboration: Omit<typeof source.collaboration, "actions"> & { actions: readonly PortfolioAction[] };
};
export type PortfolioHeading = Pick<
  PortfolioContent["about"],
  "id" | "eyebrow" | "title" | "description"
>;
export type PortfolioAction = {
  href: string; label: string;
  variant: "primary" | "secondary";
  icon: "arrow" | "play" | "email" | "whatsapp";
  external?: boolean;
};
