export function readLengthToken(token: `--${string}`): number {
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();

  // CSSOM must resolve aliases to pixels. Treating missing/rem values as zero
  // hides configuration errors and produces incorrect geometry.
  if (!/^-?\d+(?:\.\d+)?px$/.test(rawValue)) {
    throw new Error(
      `Expected a resolved pixel value for ${token}, received "${rawValue}".`,
    );
  }

  return Number.parseFloat(rawValue);
}
