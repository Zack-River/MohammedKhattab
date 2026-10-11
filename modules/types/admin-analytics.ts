export type AnalyticsPeriod = "week" | "month" | "all";
export type AnalyticsMetric = "students" | "enrollments";
export interface AnalyticsMetrics {
  studentsWeek: number; studentsPreviousWeek: number; studentsMonth: number; studentsPreviousMonth: number;
  totalStudents: number; enrollmentsWeek: number; enrollmentsPreviousWeek: number;
  enrollmentsMonth: number; enrollmentsPreviousMonth: number; totalEnrollments: number;
  studentsEnrolled: number; publishedCourses: number; completedLessons: number;
}
export interface AnalyticsDay {
  day: string; students: number; enrollments: number;
  previousStudents: number | null; previousEnrollments: number | null;
}
export interface TrendingCourse {
  slug: string; title: string; thumbnail: string | null; delivery: "recorded" | "live";
  published: boolean; count: number; previous: number;
}
export interface AnalyticsSource { source: "youtube" | "facebook" | "instagram" | "tiktok" | "google" | "direct" | "unknown"; count: number }
export interface AdminAnalytics {
  generatedAt: string; timezone: string; weekStart: string; monthStart: string;
  metrics: AnalyticsMetrics; daily: AnalyticsDay[];
  courses: Record<AnalyticsPeriod, TrendingCourse[]>; sources: AnalyticsSource[];
}

import type { analyticsCopy } from "@platform/data/admin-analytics";
export type AnalyticsLabels = { [K in keyof typeof analyticsCopy]: K extends "sourceNames" ? Record<keyof typeof analyticsCopy.sourceNames, string> : string };
