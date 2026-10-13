import {notFound} from "next/navigation";
import {ApiError} from "@platform/lib/api/error";
import {requireAdminPage} from "@platform/features/admin/page-identity";
import {readCertificate,readCertificateEvents} from "@platform/features/certificates/repository";
import {certificateCopy as labels} from "@platform/data/certificates";
import {endpoints} from "@platform/config/navigation";
import PageHeading from "@platform/components/ui/page-heading";
import CertificateDocumentView from "@platform/components/certificates/document-view";
import CertificateEventHistory from "@platform/components/certificates/event-history";
export default async function Page({params}:{params:Promise<{id:string}>}) {
 await requireAdminPage();const {id}=await params;
 const [record,events]=await Promise.all([readCertificate(id,true),readCertificateEvents(id)]).catch(error=>{if(error instanceof ApiError&&error.status===404) notFound();throw error;});
 return <><PageHeading title={record.course_title}/><div className="lms-account-stack"><CertificateDocumentView src={endpoints.adminCertificate(id)} title={labels.preview} printLabel={labels.print}/><CertificateEventHistory {...{events,labels}}/></div></>;
}
