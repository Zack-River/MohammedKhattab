import type { LinkData } from "../types/ui";
export default function DesignerCredit({ credit }: { credit: LinkData }) {
  return (
    <a className="designer-credit" href={credit.href} dir="ltr"
      target={credit.external ? "_blank" : undefined}
      rel={credit.external ? "noopener noreferrer" : undefined}>
      {credit.label}
    </a>
  );
}
