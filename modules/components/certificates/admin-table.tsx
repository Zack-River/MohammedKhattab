import CertificateAdminRow from "./admin-row";
import type {CertificateRecord,CertificateLabels} from "@platform/types/certificates";
export default function CertificateAdminTable({records,labels}:{records:CertificateRecord[];labels:CertificateLabels}) {
 return <div className="lms-admin-table-wrap" data-reveal data-reveal-motion="fade"><table className="lms-admin-table"><caption className="lms-visually-hidden">{labels.title}</caption><thead><tr>{[labels.learner,labels.course,labels.date,labels.serial,labels.filter,labels.actions].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{records.map(record=><CertificateAdminRow key={`${record.id}:${record.revision}`} {...{record,labels}}/>)}</tbody></table>{!records.length&&<p className="lms-admin-empty">{labels.empty}</p>}</div>;
}
