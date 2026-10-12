import { securityPolicy } from "@platform/config/security";
/** One valid byte range only: rejects empty ranges, reversed bounds, and unsafe integers. */
export function validMediaRange(range: string) {
  if (range.length > securityPolicy.maxRangeLength) return false;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return false;
  const start = match[1] ? Number(match[1]) : null;
  const end = match[2] ? Number(match[2]) : null;
  if ((start !== null && !Number.isSafeInteger(start)) || (end !== null && !Number.isSafeInteger(end))) return false;
  if (start === null) return end !== null && end > 0;
  return end === null || end >= start;
}
