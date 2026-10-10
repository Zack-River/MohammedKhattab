import CreatorChip from "./creator-chip";
import type { CreatorData } from "../types/marketing";

export default function CreatorMarquee({
  items,
  label,
}: {
  items: readonly CreatorData[];
  label: string;
}) {
  return (
    <div className="creators-marquee" aria-label={label}>
      <div className="creators-track">
        {[false, true].map((duplicate) =>
          items.map((creator, index) => (
            <CreatorChip
              key={`${duplicate}-${index}`}
              {...creator}
              duplicate={duplicate}
            />
          )),
        )}
      </div>
    </div>
  );
}
