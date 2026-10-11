import type { CurriculumTarget } from "@platform/types/curriculum";
export function readCurriculumForm(data: FormData, target: CurriculumTarget, revision: number) {
  return {
    ...target,
    sourceChapterId: target.chapterId,
    revision,
    title: String(data.get("title") ?? ""),
    chapterId: String(data.get("chapterId") ?? target.chapterId ?? ""),
    sectionId: String(data.get("sectionId") ?? target.sectionId ?? ""),
    description: String(data.get("description") ?? ""),
    videoUrl: String(data.get("videoUrl") ?? ""),
    durationSeconds: Number(data.get("durationSeconds")),
    preview: data.get("preview") === "on",
  };
}
