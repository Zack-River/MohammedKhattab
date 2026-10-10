import type { PortfolioAction } from "@platform/types/portfolio";
import PortfolioIcon from "./icon";
export default function PortfolioActions({
  actions,
  collaboration = false,
}: {
  actions: readonly PortfolioAction[];
  collaboration?: boolean;
}) {
  return (
    <div
      className={
        collaboration
          ? "p-ref-collab-actions-row personal-actions"
          : "p-ref-hero-actions personal-actions"
      }
    >
      {actions.map((action) => (
        <a
          key={action.href}
          href={action.href}
          className={`p-ref-btn personal-button p-ref-btn-${action.variant}`}
          target={action.external ? "_blank" : undefined}
          rel={
            action.external ? "noopener noreferrer" : undefined
          }
        >
          {collaboration && (
            <PortfolioIcon name={action.icon} />
          )}
          <span>{action.label}</span>
          {!collaboration && <PortfolioIcon name={action.icon} />}
        </a>
      ))}
    </div>
  );
}
