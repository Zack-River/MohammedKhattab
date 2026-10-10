import type { RevealSession } from "./reveal-session";
const owners = new WeakMap<Element, object>();
export function belongsToReveal(session: RevealSession, target: Element) {
  const scope = target.closest("[data-reveal-scope]");
  return (!scope || scope === session.root || !session.root.contains(scope)) &&
    (!owners.has(target) || owners.get(target) === session.owner);
}
export function claimReveal(session: RevealSession, target: Element) {
  owners.set(target, session.owner);
  session.owned.add(target);
}
export function releaseReveal(session: RevealSession, target: Element) {
  session.active.get(target)?.cancel();
  session.active.delete(target);
  session.pending.delete(target);
  session.seen.delete(target);
  session.observer?.unobserve(target);
  if (owners.get(target) === session.owner) owners.delete(target);
  session.owned.delete(target);
}
