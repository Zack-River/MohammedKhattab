export type ActivityRecord = Awaited<ReturnType<typeof import("@platform/features/admin/repositories/activity").readAdminActivity>>["records"][number];
export type ActivityLabels = {[K in keyof typeof import("@platform/data/materials").activityCopy]:string};
