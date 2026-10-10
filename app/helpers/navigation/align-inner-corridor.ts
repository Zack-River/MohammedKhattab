export function alignInnerCorridor(header: HTMLElement, desktop: boolean) {
  const root = document.documentElement;
  if (!desktop) {
    root.style.removeProperty("--inner-corridor-width");
    root.style.removeProperty("--top-capsule-width");
    return;
  }
  const brand = header.querySelector(".nav-brand-title")?.getBoundingClientRect();
  const cta = header.querySelector(".nav-cta-btn")?.getBoundingClientRect();
  const links = header.querySelectorAll(".nav-link-item a");
  if (brand && cta && brand.left > cta.right)
    root.style.setProperty("--inner-corridor-width", `${Math.round(brand.left - cta.right)}px`);
  if (links.length)
    root.style.setProperty("--top-capsule-width", `${Math.round(links[0].getBoundingClientRect().right - links[links.length - 1].getBoundingClientRect().left)}px`);
}
