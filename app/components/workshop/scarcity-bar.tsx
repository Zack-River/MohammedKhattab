import Container from "@khatab/design/ui/container";
import DiscountCountdown from "./discount-countdown";
import type { HeaderContent } from "@khatab/design/types/marketing";
import type { CountdownOptions } from "@khatab/design/types/interactions";

export default function ScarcityBar({
  content,
  offer,
}: {
  content: Pick<
    HeaderContent,
    "scarcityLabel" | "viewerCount" | "viewerLabel" | "countdown"
  >;
  offer: CountdownOptions;
}) {
  return (
    <aside className="top-scarcity-bar" aria-label={content.scarcityLabel}>
      <Container className="top-bar-inner">
        <div className="top-scarcity-nav-capsule">
          <div className="top-live-item">
            <span className="live-dot" aria-hidden="true" />
            <span>
              <b className="proof-num-highlight numeral">
                {content.viewerCount}
              </b>
              {content.viewerLabel}
            </span>
          </div>
          <span className="top-bar-sep" aria-hidden="true">
            •
          </span>
          <DiscountCountdown content={content.countdown} options={offer} />
        </div>
      </Container>
    </aside>
  );
}
