import type { RevealGroup } from "../../types/interactions";
import type { RevealSession } from "./reveal-session";
import { belongsToReveal, claimReveal } from "./reveal-ownership";
import { createEntrance } from "./create-entrance";
export function registerRevealTarget(session: RevealSession, target: Element, group: RevealGroup, index: number) {
  if (!belongsToReveal(session, target) || session.seen.has(target) || session.active.has(target)) return;
  claimReveal(session, target);
  if (session.preference.matches) {
    if (target.getBoundingClientRect().top <= window.innerHeight * session.options.viewportThreshold)
      session.seen.add(target);
    return;
  }
  const animation = createEntrance(target, group, index, session.options.easing);
  session.active.set(target, animation);
  animation.onfinish = () => {
    animation.cancel();
    session.active.delete(target);
    session.seen.add(target);
  };
  if (group.immediate) animation.play();
  else session.pending.set(target, [animation]);
}
