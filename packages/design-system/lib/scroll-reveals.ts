import type { RevealOptions } from "../types/interactions";
import { createRevealSession } from "../helpers/motion/reveal-session";
import { registerReveals } from "../helpers/motion/register-reveals";
import { observeReveals } from "../helpers/motion/observe-reveals";
import { updateRevealChildren } from "../helpers/motion/update-reveal-children";
import { updateRevealPreference } from "../helpers/motion/update-reveal-preference";
import { disposeReveals } from "../helpers/motion/dispose-reveals";
/** One lifecycle coordinates focused reveal helpers without owning their details. */
export interface ScrollRevealLifecycle {
  root: HTMLElement;
  options: RevealOptions;
  preference: MediaQueryList;
}
export function createScrollReveals({ root, options, preference }: ScrollRevealLifecycle) {
  const session = createRevealSession(root, options, preference);
  const observe = () => observeReveals(session);
  const onPreferenceChange = () => updateRevealPreference(session);
  const mutations = new MutationObserver((records) => updateRevealChildren(session, records));
  mutations.observe(root, { childList: true, subtree: true });
  preference.addEventListener("change", onPreferenceChange);
  window.addEventListener("resize", observe, { passive: true });
  registerReveals(session);
  return () => {
    disposeReveals(session);
    mutations.disconnect();
    preference.removeEventListener("change", onPreferenceChange);
    window.removeEventListener("resize", observe);
  };
}
