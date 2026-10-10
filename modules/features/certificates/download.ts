import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { findCourse } from "@platform/features/catalog";
import { readLearningState, courseProgress } from "@platform/features/learning";
import { certificatePresentation } from "./presentation";
import { renderCertificate } from "./renderer";
import { interfaceCopy } from "@platform/data/interface-copy";
import { site } from "@platform/data/site";
import { learningIdentity } from "@/config/identity";
export async function downloadCertificate(slug: string) {
  await requireIdentity();
  const course = await findCourse(slug);
  if (!course) throw new ApiError(404, "NOT_FOUND");
  const state = await readLearningState();
  if (!state.enrolled.includes(slug) || courseProgress(course, state).percent !== 100) throw new ApiError(403, "FORBIDDEN");
  const svg = renderCertificate({ brandName: site.name, brandEnglishName: site.englishName,
    learnerName: state.profile.name, courseTitle: course.title, title: interfaceCopy.certificateTitle,
    disclaimer: interfaceCopy.certificateDisclaimer }, certificatePresentation);
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8",
    "Content-Disposition": `attachment; filename="${learningIdentity.exportPrefix}-${slug}.svg"` } });
}
