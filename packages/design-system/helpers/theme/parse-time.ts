export function parseThemeTime(value: string, name: string) {
  // Optimized CSS may use .5s instead of 500ms.
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)$/.test(value)) throw new Error(`Invalid motion time ${name}`);
  return parseFloat(value) * (value.endsWith("ms") ? 1 : 1000);
}
