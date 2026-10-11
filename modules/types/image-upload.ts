export type ImageUploadTarget = { kind: "avatar" } | { kind: "course"; courseSlug: string };
export interface UploadedImage { url: string; publicId: string; width: number; height: number; }
export interface ImageUploadLabels { title: string; choose: string; uploading: string; saved: string; hint: string; error: string; }
