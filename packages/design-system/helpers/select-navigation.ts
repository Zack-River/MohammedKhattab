import type { SelectOption } from "../types/select";
export function selectNavigation(key: string, active: number, options: readonly SelectOption[]) {
  const available = options.map((option, index) => option.disabled ? -1 : index).filter(index => index >= 0);
  if (key === "Home") return available[0] ?? -1;
  if (key === "End") return available.at(-1) ?? -1;
  const direction = key === "ArrowUp" ? -1 : 1, current = available.indexOf(active);
  return available[(current + direction + available.length) % available.length] ?? -1;
}
export function selectTypeahead(text: string, options: readonly SelectOption[]) {
  return options.findIndex(option => !option.disabled && option.label.toLocaleLowerCase().startsWith(text.toLocaleLowerCase()));
}
