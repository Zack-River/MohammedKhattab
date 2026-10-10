import type { SocialLinkData } from "../types/ui";
import SocialIcon from "./social-icon";

export default function SocialLinks({
  links,
  className,
}: {
  links: readonly SocialLinkData[];
  className?: string;
}) {
  return (
    <ul
      className={["footer-social-links", className].filter(Boolean).join(" ")}
    >
      {links.map((link) => (
        <li key={link.platform}>
          <a
            href={link.href}
            className="social-btn"
            target={link.external === false ? undefined : "_blank"}
            rel={link.external === false ? undefined : "noopener noreferrer"}
            title={link.title}
            aria-label={link.label}
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
