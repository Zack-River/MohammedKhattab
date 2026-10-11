import { navigationRootMargin } from "./navigation-root-margin";
export function observeActiveSection(ids: readonly string[], onActive: (id: string) => void) {
  const visible = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    const current = [...visible].sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
    onActive(current?.id ?? "");
  }, { rootMargin: navigationRootMargin() });
  ids.forEach((id) => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
  return observer;
}
