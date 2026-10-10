"use client";

import { Fragment } from "react";
import { useDiscountCountdown } from "@/app/hooks/use-discount-countdown";
import type {
  CountdownContent,
  CountdownOptions,
} from "@khatab/design/types/interactions";

export default function DiscountCountdown({
  content,
  options,
}: {
  content: CountdownContent;
  options: CountdownOptions;
}) {
  const time = useDiscountCountdown(options);
  return (
    <div className="top-timer-item">
      <span className="top-timer-label">{content.label}</span>
      <div
        className="top-timer-boxes"
        role="timer"
        aria-label={content.accessibleLabel}
        aria-live="off"
      >
        {content.units.map((unit, index) => (
          <Fragment key={unit.key}>
            {index > 0 && (
              <span className="timer-sep" aria-hidden="true">
                :
              </span>
            )}
            <div className="timer-unit-box">
              <b className="numeral" data-countdown-unit={unit.key}>
                {time[unit.key]}
              </b>
              <small>{unit.label}</small>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
