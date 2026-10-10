import type { RevealSession } from "./reveal-session";
import { releaseReveal } from "./reveal-ownership";
import { registerReveals } from "./register-reveals";
export function updateRevealChildren(session: RevealSession, records: MutationRecord[]) {
  // Reinsertion in the same mutation batch still starts a new DOM occurrence.
  for (const record of records)
    for (const removed of record.removedNodes)
      for (const target of session.owned)
        if (removed === target || removed.contains(target)) releaseReveal(session, target);
  registerReveals(session);
}
