import type { ContentBindings } from "@platform/types/content";

import type { CourseOffer } from "@platform/types/lms";

export default function CoursePrice({
  offer,
  compact = false,
  offerCopy,
}: {
  offer: CourseOffer;
  compact?: boolean;
} & { offerCopy: Pick<ContentBindings["offerCopy"], "price"> }) {
  return (
    <div className={`lms-course-price${compact ? " lms-price-compact" : ""}`}>
      <div>
        {!compact && <span className="lms-price-label">{offerCopy.price}</span>}
        <strong>
          <bdi className="numeral">{offer.amount}</bdi>{" "}
          <small>{offer.currencyLabel}</small>
        </strong>
      </div>
      {!compact && <span className="lms-price-caption">{offer.caption}</span>}
    </div>
  );
}
