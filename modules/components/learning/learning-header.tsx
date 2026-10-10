import type { ContentBindings } from "@platform/types/content";
import { routes } from "@platform/config/navigation";
import Link from "next/link";
import Brand from "@platform/components/layout/brand";
import Symbol from "@platform/components/ui/symbol";
export default function LearningHeader({
  interfaceCopy,
  site,
}: {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "dashboardLabel">;
  site: Pick<ContentBindings["site"], "demoLabel" | "name" | "englishName">;
}) {
  return (
    <header className="lms-app-header">
      <Brand site={{ name: site.name, englishName: site.englishName }} />
      <span className="lms-demo-label">{site.demoLabel}</span>
      <Link href={routes.dashboard} className="lms-text-link">
        {interfaceCopy.dashboardLabel}
        <Symbol name="arrow" />
      </Link>
    </header>
  );
}
