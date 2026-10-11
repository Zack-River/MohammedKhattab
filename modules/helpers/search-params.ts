export function searchParams(values: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values))
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) params.append(key, item);
  return params;
}
