import type { CurriculumMutation } from "@platform/types/curriculum";
import { curriculumPolicy as policy } from "@platform/config/curriculum";
import { validMediaUrl } from "./validate-media-url";
const identifier = (value: unknown) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 100;
export function validateCurriculumMutation(body: Record<string,unknown> | null): CurriculumMutation | null {
  if (!body || !["chapter","section","lesson"].includes(String(body.kind)) || !["create","edit","delete"].includes(String(body.operation)) || !Number.isSafeInteger(body.revision) || Number(body.revision) < 0) return null;
  if (body.operation !== "create" && !identifier(body.id)) return null;
  if (body.kind !== "chapter" && !identifier(body.chapterId)) return null;
  if (body.sourceChapterId !== undefined && !identifier(body.sourceChapterId)) return null;
  if (body.sectionId !== undefined && body.sectionId !== "" && !identifier(body.sectionId)) return null;
  if (body.operation === "delete") return body as unknown as CurriculumMutation;
  if (typeof body.title !== "string" || body.title.trim().length < policy.titleMin || body.title.trim().length > policy.titleMax) return null;
  if (body.kind === "lesson" && (typeof body.description !== "string" || body.description.length > policy.descriptionMax || !Number.isSafeInteger(body.durationSeconds) || Number(body.durationSeconds) <= 0 || Number(body.durationSeconds) > policy.maxDurationSeconds || !body.videoUrl || !validMediaUrl(body.videoUrl) || typeof body.preview !== "boolean")) return null;
  return { ...body, title: body.title.trim() } as unknown as CurriculumMutation;
}
