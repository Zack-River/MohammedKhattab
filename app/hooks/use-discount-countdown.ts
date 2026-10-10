import { useEffect, useState } from "react";
import type { CountdownOptions } from "@khatab/design/types/interactions";
import {
  splitCountdown,
  resolveCountdownDeadline,
  remainingCountdownSeconds,
} from "@/app/lib/countdown";

export function useDiscountCountdown(options: CountdownOptions) {
  // Identical server and first-client snapshot; clock/storage are read after hydration.
  const [remaining, setRemaining] = useState(options.durationSeconds);
  const { durationSeconds, endsAt, storageKey, tickMs } = options;
  useEffect(() => {
    let storage: Storage | undefined;
    try {
      storage = window.localStorage;
    } catch {
      /* Storage access can be blocked. */
    }
    const deadline = resolveCountdownDeadline(
      { durationSeconds, endsAt, storageKey, tickMs },
      Date.now(),
      storage,
    );
    const update = () =>
      setRemaining(remainingCountdownSeconds(deadline, Date.now()));
    const firstTick = window.setTimeout(update, 0);
    const interval = window.setInterval(update, tickMs);
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(interval);
    };
  }, [durationSeconds, endsAt, storageKey, tickMs]);
  return splitCountdown(remaining);
}
