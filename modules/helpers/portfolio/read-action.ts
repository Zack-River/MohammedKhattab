import type { PortfolioAction } from "@platform/types/portfolio";
export function readPortfolioAction(action: { href: string; label: string; variant: string; icon: string; external?: boolean }): PortfolioAction {
  const { variant, icon } = action;
  if (variant !== "primary" && variant !== "secondary") throw new Error("Invalid portfolio action variant");
  if (icon !== "arrow" && icon !== "play" && icon !== "email" && icon !== "whatsapp") throw new Error("Invalid portfolio action icon");
  return { ...action, variant, icon };
}
