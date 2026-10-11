import { analyticsConfig } from "@platform/config/admin-analytics";
export const formatAnalyticsNumber = (value: number) => new Intl.NumberFormat(analyticsConfig.locale, { maximumFractionDigits: 1 }).format(value);
export const formatAnalyticsDate = (value: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) =>
  new Intl.DateTimeFormat(analyticsConfig.locale, { ...options, timeZone: analyticsConfig.timezone }).format(new Date(value));
export const formatChartDay = (value: string) => formatAnalyticsNumber(Number(value.slice(-2)));
