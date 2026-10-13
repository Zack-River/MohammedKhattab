import { commercePolicy } from "@platform/config/commerce";
export function readCommerceQuery(query: Record<string, string | string[] | undefined>, states: Record<string, string>) {
  const text = (name: string) => typeof query[name] === "string" ? query[name] as string : "";
  return { search: text("q").slice(0, commercePolicy.maxSearch),
    status: Object.hasOwn(states, text("status")) ? text("status") : "all",
    page: Math.min(10000, Math.max(1, Math.floor(Number(text("page")) || 1))) };
}
