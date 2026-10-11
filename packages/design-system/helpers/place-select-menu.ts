/** Keep the top-layer menu within the viewport, including small landscape screens. */
export function placeSelectMenu(button: HTMLElement, panel: HTMLElement) {
  const rect = button.getBoundingClientRect();
  const style = getComputedStyle(panel), gap = parseFloat(style.getPropertyValue("--space-sm")) || 0;
  const width = Math.min(rect.width, window.innerWidth - gap * 2);
  panel.style.width = `${width}px`;
  const roomBelow = window.innerHeight - rect.bottom - gap * 2, roomAbove = rect.top - gap * 2;
  const desired = Math.min(panel.scrollHeight, parseFloat(style.getPropertyValue("--control-menu-max-height")));
  const above = roomBelow < desired && roomAbove > roomBelow;
  const height = Math.min(desired, above ? roomAbove : roomBelow);
  panel.style.maxHeight = `${Math.max(gap, height)}px`;
  const left = style.direction === "rtl" ? rect.right - width : rect.left;
  panel.style.left = `${Math.max(gap, Math.min(left, window.innerWidth - width - gap))}px`;
  panel.style.top = `${above ? rect.top - gap - height : rect.bottom + gap}px`;
}
