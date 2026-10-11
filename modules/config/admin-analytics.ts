export const analyticsConfig = {
  timezone: "Africa/Cairo", locale: "ar-EG-u-nu-latn", trendLimit: 5,
  periods: ["week", "month", "all"] as const,
  sources: ["youtube", "facebook", "instagram", "tiktok", "google", "direct", "unknown"] as const,
  metrics: ["studentsWeek", "studentsPreviousWeek", "studentsMonth", "studentsPreviousMonth", "totalStudents",
    "enrollmentsWeek", "enrollmentsPreviousWeek", "enrollmentsMonth", "enrollmentsPreviousMonth", "totalEnrollments",
    "studentsEnrolled", "publishedCourses", "completedLessons"] as const,
};
