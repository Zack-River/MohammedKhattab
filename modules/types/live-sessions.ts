export interface LiveSession {
 id: string; courseSlug: string; title: string; description: string; startsAt: string; endsAt: string;
 courseTitle?: string; assignmentTitle?: string;
 timezone: string; chapterId: string | null; sectionId: string | null;
}
export interface AdminLiveSession extends LiveSession { joinUrl: string; enabled: boolean; revision: number; }
export interface LiveSessionInput {
 id?: string; revision: number; courseSlug: string; title: string; description: string; joinUrl: string;
 startsLocal: string; endsLocal: string; timezone: string; enabled: boolean; chapterId: string; sectionId: string;
}
export type LiveSessionState = "upcoming" | "active" | "ended";
export type LiveSessionLabels = { [K in keyof typeof import("@platform/data/live-sessions").liveSessionCopy]: string };
