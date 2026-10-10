export function updatePortfolioHeader(header: HTMLElement, hero: HTMLElement | null) {
  const threshold = parseFloat(getComputedStyle(header).getPropertyValue("--personal-header-scroll-threshold"));
  header.classList.toggle("p-ref-is-scrolled", scrollY > threshold);
  header.querySelector(".p-ref-brand-name")?.classList.toggle("p-ref-is-hero-active",
    Boolean(hero && hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom));
}
