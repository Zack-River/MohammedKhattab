export const liveSessionPolicy = {
 pageSize: 5, titleMax: 160, descriptionMax: 4000, urlMax: 2048, maxHours: 24,
 pollMs: 30000, tickMs: 1000, defaultTimezone: "Africa/Cairo",
 timezones: ["Africa/Cairo", "Asia/Riyadh", "UTC"],
} as const;
