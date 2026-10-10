import AssetImage from "@khatab/design/ui/asset-image";
import type { CreatorData } from "@khatab/design/types/marketing";
import type { PortfolioHeading } from "@platform/types/portfolio";
import PortfolioSection from "./section";
export default function PortfolioClients({
  content,
  clients,
}: {
  content: PortfolioHeading;
  clients: readonly CreatorData[];
}) {
  return (
    <PortfolioSection content={content} className="p-ref-clients-section">
      <div className="p-ref-clients-grid personal-clients">
        {clients.map((client) => (
          <article
            className="p-ref-client-card personal-client"
            key={client.name}
            data-reveal
          >
            <AssetImage asset={client.image} className="p-ref-client-avatar" />
            <span className="p-ref-client-name">{client.name}</span>
          </article>
        ))}
      </div>
    </PortfolioSection>
  );
}
