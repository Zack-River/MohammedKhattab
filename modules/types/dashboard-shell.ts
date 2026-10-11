import type { ContentBindings } from "./content";
import type { useMobileMenu } from "@khatab/design/hooks/use-mobile-menu";
export type DashboardShellProps = {
  children: React.ReactNode;
  name: string;
  sessionEndpoint?: string;
  showSidebarHelp?: boolean;
  showBrowseLink?: boolean;
} & {
  interfaceCopy: Pick<
    ContentBindings["interfaceCopy"],
    | "studentNavigationLabel"
    | "sidebarTitle"
    | "sidebarDescription"
    | "homeLabel"
  >;
  dashboardNavigation: ContentBindings["dashboardNavigation"];
  site: Pick<ContentBindings["site"], "demoLabel" | "name" | "englishName">;
  copy: Pick<
    ContentBindings["copy"],
    "browse" | "profileTitle" | "menu" | "demoAccount"
  > & { logout?: string; error?: string };
};
export type DashboardMenu = ReturnType<typeof useMobileMenu>;
