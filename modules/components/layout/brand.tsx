import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";
import Link from "next/link";
export default function Brand({
  site,
  href = routes.home,
}: {
  href?: string;
  site: Pick<ContentBindings["site"], "name" | "englishName">;
}) {
  return (
    <Link href={href} className="lms-brand" aria-label={site.name}>
      <span className="lms-brand-mark" aria-hidden="true">
        ▲
      </span>
      <span>
        {site.name}
        <small>{site.englishName}</small>
      </span>
    </Link>
  );
}
