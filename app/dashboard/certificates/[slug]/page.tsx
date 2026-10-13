import {notFound} from "next/navigation";
import {ApiError} from "@platform/lib/api/error";
import {requirePageIdentity} from "@platform/features/auth/server/page-identity";
import {readStudentCertificate} from "@platform/features/certificates/download";
import CertificateDocumentView from "@platform/components/certificates/document-view";
import {certificateCopy as labels} from "@platform/data/certificates";
import {endpoints} from "@platform/config/navigation";
export default async function Page({params}:{params:Promise<{slug:string}>}) {
 await requirePageIdentity();const {slug}=await params;await readStudentCertificate(slug).catch(error=>{if(error instanceof ApiError&&(error.status===403||error.status===404)) notFound();throw error;});
 return <CertificateDocumentView src={endpoints.certificate(slug)+"?view=1"} title={labels.preview} printLabel={labels.print}/>;
}
