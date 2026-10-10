export function navigationRootMargin() {
  // IntersectionObserver resolves percentages against width, not viewport height.
  return getComputedStyle(document.documentElement).getPropertyValue("--personal-navigation-root-margin")
    .trim().split(/\s+/).map((value, index) => index % 2 === 0 && value.endsWith("%")
      ? `${parseFloat(value) / 100 * innerHeight}px` : value).join(" ");
}
