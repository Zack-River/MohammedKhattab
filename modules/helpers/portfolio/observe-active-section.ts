import { navigationRootMargin } from "./navigation-root-margin";
export function observeActiveSection(ids: readonly string[], onActive: (id: string) => void) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
    if (visible[0]) onActive(visible[0].target.id);
  }, { rootMargin: navigationRootMargin() });
  ids.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
  return observer;
}
