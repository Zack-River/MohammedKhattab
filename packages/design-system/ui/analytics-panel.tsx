import type { ReactNode } from "react";
export default function AnalyticsPanel({ title, description, children, className = "" }: {
  title: string; description?: string; children: ReactNode; className?: string;
}) {
  return <section className={`analytics-panel ${className}`} aria-label={title}>
    <header className="analytics-panel-heading"><h2>{title}</h2>{description && <p>{description}</p>}</header>
    <div className="analytics-panel-body">{children}</div>
  </section>;
}
