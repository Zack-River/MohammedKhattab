import { adminCoursePolicy as policy } from "@platform/config/admin";
export function validMediaUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > policy.urlMax) return false;
  if (!value) return true;
  if (/^\/assets\/[\w\-./]+$/.test(value)) return !value.split("/").includes("..");
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password; } catch { return false; }
}
