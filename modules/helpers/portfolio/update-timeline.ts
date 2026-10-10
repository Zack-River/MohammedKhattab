export function updatePortfolioTimeline(root: HTMLElement, reduced: boolean) {
  const rect = root.getBoundingClientRect();
  const threshold = parseFloat(getComputedStyle(root).getPropertyValue("--personal-timeline-trigger"));
  const edge = innerHeight * threshold;
  root.style.setProperty("--personal-progress", String(reduced ? 1 : Math.max(0, Math.min(1, (edge - rect.top) / rect.height))));
  root.querySelectorAll<HTMLElement>("[data-timeline-item]").forEach((item) =>
    item.classList.toggle("is-active", reduced || item.getBoundingClientRect().top <= edge));
}
