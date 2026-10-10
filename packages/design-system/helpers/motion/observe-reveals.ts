import type { RevealSession } from "./reveal-session";
function reveal(session: RevealSession, target: Element) {
  session.pending.get(target)?.forEach((animation) => animation.play());
  session.pending.delete(target);
  session.observer?.unobserve(target);
}
export function observeReveals(session: RevealSession) {
  session.observer?.disconnect();
  if (session.preference.matches || session.disposed) return;
  const threshold = window.innerHeight * session.options.viewportThreshold;
  session.observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => { if (entry.isIntersecting) reveal(session, entry.target); }),
    { rootMargin: `0px 0px -${window.innerHeight - threshold}px 0px`, threshold: 0 },
  );
  session.pending.forEach((_, target) => {
    if (target.getBoundingClientRect().top <= threshold) reveal(session, target);
    else session.observer?.observe(target);
  });
}
