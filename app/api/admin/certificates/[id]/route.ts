import {apiResponse} from "@platform/lib/api/respond";
import {readCertificate} from "@platform/features/certificates/repository";
import {certificateSvg,certificateResponse} from "@platform/features/certificates/document";
import {certificateDocument} from "@platform/data/certificates";
export const GET=(_request:Request,{params}:{params:Promise<{id:string}>})=>apiResponse(async()=>{
 const record=await readCertificate((await params).id,true);
 return certificateResponse(certificateSvg(record,record.status==="revoked"?certificateDocument.revoked:""),`ta3allam-${record.id}`,true);
});
