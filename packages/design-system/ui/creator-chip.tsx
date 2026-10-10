import AssetImage from "./asset-image";
import type { CreatorData } from "../types/marketing";

export default function CreatorChip({
  name,
  platform,
  image,
  duplicate,
}: CreatorData & { duplicate?: boolean }) {
  return (
    <div className="creator-chip" aria-hidden={duplicate || undefined}>
      <div className="creator-avatar">
        <AssetImage
          asset={duplicate ? { ...image, alt: "" } : image}
          className="creator-avatar-photo"
        />
      </div>
      <span className="creator-name">{name}</span>
      <span className="creator-platform">{platform}</span>
    </div>
  );
}
