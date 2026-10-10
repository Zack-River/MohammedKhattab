import type { RevealOptions } from "../../types/interactions";
export interface RevealSession {
  root: HTMLElement;
  options: RevealOptions;
  preference: MediaQueryList;
  owner: object;
  seen: WeakSet<Element>;
  owned: Set<Element>;
  active: Map<Element, Animation>;
  pending: Map<Element, Animation[]>;
  observer?: IntersectionObserver;
  disposed: boolean;
}
export function createRevealSession(root: HTMLElement, options: RevealOptions, preference: MediaQueryList): RevealSession {
  return { root, options, preference, owner: {}, seen: new WeakSet(), owned: new Set(),
    active: new Map(), pending: new Map(), disposed: false };
}
