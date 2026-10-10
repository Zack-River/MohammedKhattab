import Link from "next/link";
import type { ProjectNavigationContent } from "../types/project-navigation";
export default function ProjectNavigation({ content, currentHref }: {
  content: ProjectNavigationContent;
  currentHref?: string;
}) {
  return (
    <nav className="project-navigation" aria-label={content.label} data-project-navigation>
      {content.links.map((link) => (
        <Link key={link.href} href={link.href} aria-current={currentHref === link.href ? "page" : undefined}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
