import type { RevealSession } from "./reveal-session";
import { releaseReveal } from "./reveal-ownership";
export function disposeReveals(session: RevealSession) {
  session.disposed = true;
  session.observer?.disconnect();
  session.active.forEach((animation) => animation.cancel());
  session.active.clear();
  session.pending.clear();
  for (const target of session.owned) releaseReveal(session, target);
}
