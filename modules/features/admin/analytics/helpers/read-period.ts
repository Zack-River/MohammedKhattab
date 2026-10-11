import type { AnalyticsPeriod } from "@platform/types/admin-analytics";
import { analyticsConfig } from "@platform/config/admin-analytics";
export function readAnalyticsPeriod(value: unknown): AnalyticsPeriod {
  return typeof value === "string" && analyticsConfig.periods.some(period => period === value) ? value as AnalyticsPeriod : "week";
}
