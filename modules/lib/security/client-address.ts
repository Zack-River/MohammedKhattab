import { isIP } from "node:net";
/** Only Vercel's overwritten edge header is trusted; arbitrary proxies cannot choose buckets. */
export function clientAddress(headers: Headers, onVercel = process.env.VERCEL === "1") {
  if (!onVercel) return "local-ingress";
  const address = headers.get("x-vercel-forwarded-for")?.trim();
  return address && isIP(address) ? address : "unknown-ingress";
}
