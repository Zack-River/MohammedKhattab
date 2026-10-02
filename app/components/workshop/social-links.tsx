import type { JSX } from "react";
import { socialLinks } from "@/app/config/site";
import SocialIcon from "./social-icon";

export default function SocialLinks(): JSX.Element {
  return (
    <ul
      className="flex items-center gap-3"
      aria-label="روابط التواصل الاجتماعي لمحمد خطاب"
    >
      {socialLinks.map(({ platform, href, title, label }) => (
        <li key={platform}>
          <a
            href={href}
            className="inline-flex size-11 items-center justify-center rounded border border-line bg-panel text-copy transition-[translate,scale,color,border-color,background-color] duration-200 motion-safe:hover:-translate-y-0.5 hover:border-brand/35 hover:bg-brand/10 hover:text-brand motion-safe:active:translate-y-0 motion-safe:active:scale-95 motion-reduce:translate-none motion-reduce:scale-none motion-reduce:transition-none [&_svg]:size-5 [&_svg]:fill-current"
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            aria-label={label}
          >
            <SocialIcon platform={platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
