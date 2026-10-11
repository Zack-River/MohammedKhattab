import { ApiError } from "@platform/lib/api/error";
import { analyticsConfig } from "@platform/config/admin-analytics";
import type { AdminAnalytics } from "@platform/types/admin-analytics";
import { objectRecord, isCount, isTimestamp, isDay, isCourse, isSource } from "./validate-records";
export function readAnalyticsSnapshot(value: unknown): AdminAnalytics {
  const r = objectRecord(value), metrics = objectRecord(r?.metrics), courses = objectRecord(r?.courses);
  if (r && metrics && courses && [r.generatedAt, r.weekStart, r.monthStart].every(isTimestamp) && r.timezone === analyticsConfig.timezone
    && analyticsConfig.metrics.every(key => isCount(metrics[key]))
    && Array.isArray(r.daily) && r.daily.length <= 31 && r.daily.every(isDay)
    && analyticsConfig.periods.every(key => Array.isArray(courses[key]) && courses[key].length <= analyticsConfig.trendLimit && courses[key].every(isCourse))
    && Array.isArray(r.sources) && r.sources.every(isSource)) return r as unknown as AdminAnalytics;
  throw new ApiError(503, "INTERNAL_ERROR");
}
