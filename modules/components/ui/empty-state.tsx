import Link from "next/link";
import Symbol from "./symbol";
export default function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
} & ({ href: string; label: string } | { href?: never; label?: never })) {
  if (href !== undefined && (!href.trim() || !label?.trim()))
    throw new Error("Invalid empty-state action");
  return (
    <div className="lms-empty">
      <Symbol name="book" />
      <h2>{title}</h2>
      <p>{description}</p>
      {href && (
        <Link href={href} className="btn-primary">
          {label}
        </Link>
      )}
    </div>
  );
}
