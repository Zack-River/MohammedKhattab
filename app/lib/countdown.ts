import type { CountdownOptions } from "@khatab/design/types/interactions";

const MILLISECONDS_PER_SECOND = 1000;
type DeadlineStorage = Pick<Storage, "getItem" | "setItem">;

export function resolveCountdownDeadline(
  options: CountdownOptions,
  now: number,
  storage?: DeadlineStorage,
) {
  if (options.endsAt) {
    const deadline = Date.parse(options.endsAt);
    if (!Number.isFinite(deadline))
      throw new Error(
        "Countdown endsAt must be an ISO timestamp with timezone.",
      );
    return deadline;
  }
  const deadline = now + options.durationSeconds * MILLISECONDS_PER_SECOND;
  try {
    const stored = storage?.getItem(options.storageKey);
    const saved = stored == null ? NaN : Number(stored);
    if (Number.isFinite(saved) && saved > 0) return saved;
    storage?.setItem(options.storageKey, String(deadline));
  } catch {
    // Storage may be blocked; keep a deadline for this mounted session.
  }
  return deadline;
}

export function remainingCountdownSeconds(deadline: number, now: number) {
  return Math.max(0, Math.floor((deadline - now) / MILLISECONDS_PER_SECOND));
}

export function splitCountdown(seconds: number) {
  const remaining = Math.max(0, Math.floor(seconds));
  return {
    days: String(Math.floor(remaining / 86400)).padStart(2, "0"),
    hours: String(Math.floor((remaining % 86400) / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"),
    seconds: String(remaining % 60).padStart(2, "0"),
  };
}
