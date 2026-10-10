export function parseThemeNumber(value: string, name: string) {
  const number = parseFloat(value);
  if (!Number.isFinite(number)) throw new Error(`Invalid motion token ${name}`);
  return number;
}
