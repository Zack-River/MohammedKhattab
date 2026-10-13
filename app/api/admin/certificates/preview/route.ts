import {requireAdmin} from "@platform/features/admin/identity";
import {apiResponse} from "@platform/lib/api/respond";
import {certificateDocument,certificatePreview} from "@platform/data/certificates";
import {certificatePresentation} from "@platform/features/certificates/presentation";
import {renderCertificate} from "@platform/features/certificates/renderer";
import {certificateResponse} from "@platform/features/certificates/document";
import {formatCourseDate} from "@platform/helpers/format-course-date";
export const GET=()=>apiResponse(async()=>{await requireAdmin();return certificateResponse(renderCertificate({...certificateDocument,...certificatePreview,issuedDate:formatCourseDate(certificatePreview.issuedAt,""),lessonCount:String(certificatePreview.lessonCount),watermark:certificateDocument.preview},certificatePresentation),"ta3allam-preview",true);});
