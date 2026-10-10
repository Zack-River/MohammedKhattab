import type { RevealSession } from "./reveal-session";
import { registerReveals } from "./register-reveals";
export function updateRevealPreference(session: RevealSession) {
  if (session.preference.matches) {
    session.observer?.disconnect();
    session.active.forEach((animation, target) => {
      if (animation.playState === "running") session.seen.add(target);
      animation.cancel();
    });
    session.active.clear();
    session.pending.clear();
  }
  registerReveals(session);
}
