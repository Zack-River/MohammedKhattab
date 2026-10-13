import {endpoints,routes} from "@platform/config/navigation";
import Symbol from "@platform/components/ui/symbol";
import {formatCourseDate} from "@platform/helpers/format-course-date";
import type {CertificateRecord,CertificateLabels} from "@platform/types/certificates";
export default function CertificateCard({record,labels,heading,brand,accessible=true}:{record:CertificateRecord;labels:CertificateLabels;heading:string;brand:string;accessible?:boolean}) {
 return <article className="lms-certificate" data-reveal data-reveal-motion="fade"><Symbol name="award"/><span>{brand}</span><h2>{heading}</h2><p>{record.learner_name}</p><h3>{record.course_title}</h3>
  <small>{labels.date}: {formatCourseDate(record.issued_at,"")}</small><small>{labels.serial}: <span dir="ltr" className="lms-record-id">{record.id}</span></small>
  {record.status==="revoked"||!accessible?<p className="lms-error">{record.status==="revoked"?labels.locked:labels.accessLocked}</p>:<a className="lms-secondary-button" href={endpoints.certificate(record.course_slug)}><Symbol name="download"/>{labels.download}</a>}
  {record.status==="issued"&&accessible&&<a className="lms-text-link" href={routes.certificate(record.course_slug)}>{labels.preview}</a>}
 </article>;
}
