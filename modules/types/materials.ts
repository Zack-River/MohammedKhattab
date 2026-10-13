export interface MaterialAssignment {courseSlug:string;lessonId:string}
export interface MaterialInput {id?:string;revision:number;title:string;description:string;type:string;kind:"text"|"link";content:string;assignments:MaterialAssignment[]}
export interface AdminMaterial extends MaterialInput {id:string;createdAt:string;updatedAt:string}
export type MaterialLabels = {[K in keyof typeof import("@platform/data/materials").materialCopy]:string};
export interface SavedLessonNote {text:string;revision:number}
export type NoteLabels = {[K in keyof typeof import("@platform/data/materials").noteCopy]:string};
export interface CourseChoice {slug:string;title:string;chapters:{id:string;title:string;sections:{id:string;title:string}[]}[];lessons:{id:string;title:string}[]}
export interface RecordQuery {search:string;filter:string;page:number}
