import type { RevealSession } from "./reveal-session";
import { releaseReveal } from "./reveal-ownership";
import { registerRevealTarget } from "./register-reveal-target";
import { observeReveals } from "./observe-reveals";
export function registerReveals(session: RevealSession) {
  if (session.disposed) return;
  for (const target of session.owned) if (!session.root.contains(target)) releaseReveal(session, target);
  for (const group of session.options.groups) {
    for (const trigger of session.root.querySelectorAll(group.trigger)) {
      const targets = group.children ? Array.from(trigger.children)
        : group.target ? Array.from(trigger.querySelectorAll(group.target)) : [trigger];
      targets.forEach((target, index) => registerRevealTarget(session, target, group, index));
    }
  }
  observeReveals(session);
}
