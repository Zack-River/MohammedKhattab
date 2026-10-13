import {certificateDocumentPolicy} from "@platform/config/certificates";
import {certificateDocument} from "@platform/data/certificates";
import {certificatePresentation} from "./presentation";
import {renderCertificate} from "./renderer";
import {formatCourseDate} from "@platform/helpers/format-course-date";
import type {CertificateRecord} from "@platform/types/certificates";
export function certificateSvg(record:CertificateRecord,watermark="") {
 return renderCertificate({...certificateDocument,learnerName:record.learner_name,courseTitle:record.course_title,
  issuedDate:formatCourseDate(record.issued_at,""),serial:record.id,lessonCount:String(record.lesson_count),watermark},certificatePresentation);
}
export function certificateResponse(svg:string,filename:string,inline=false) {
 return new Response(svg,{headers:{"Content-Security-Policy":certificateDocumentPolicy,"Content-Type":"image/svg+xml; charset=utf-8","Content-Disposition":`${inline?"inline":"attachment"}; filename="${filename}.svg"`}});
}
