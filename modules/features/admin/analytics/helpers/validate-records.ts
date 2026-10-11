import { analyticsConfig } from "@platform/config/admin-analytics";
import type { AnalyticsDay, AnalyticsSource, TrendingCourse } from "@platform/types/admin-analytics";
export function objectRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
export const isCount = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
export const isTimestamp = (value: unknown): value is string => typeof value === "string" && Number.isFinite(Date.parse(value));
export function isDay(value: unknown): value is AnalyticsDay {
  const r = objectRecord(value);
  return Boolean(r && typeof r.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.day) && isTimestamp(r.day) && isCount(r.students) && isCount(r.enrollments)
    && (r.previousStudents === null || isCount(r.previousStudents)) && (r.previousEnrollments === null || isCount(r.previousEnrollments)));
}
export function isCourse(value: unknown): value is TrendingCourse {
  const r = objectRecord(value);
  return Boolean(r && typeof r.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug) && typeof r.title === "string"
    && (r.thumbnail === null || typeof r.thumbnail === "string") && ["recorded", "live"].includes(String(r.delivery))
    && typeof r.published === "boolean" && isCount(r.count) && isCount(r.previous));
}
export function isSource(value: unknown): value is AnalyticsSource {
  const r = objectRecord(value);
  return Boolean(r && analyticsConfig.sources.some(source => source === r.source) && isCount(r.count));
}
