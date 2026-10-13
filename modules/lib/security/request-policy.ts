import {endpoints} from "@platform/config/navigation";
import {certificateDocumentPolicy} from "@platform/config/certificates";
import {contentPolicy} from "./content-policy";
/** Proxy response headers are authoritative; scope embedded-font access to SVG endpoints. */
export function requestPolicy(request:Pick<Request,"method"|"url">,nonce:string) {
 const path=new URL(request.url).pathname;
 const document=request.method==="GET"&&[endpoints.certificates+"/",endpoints.adminCertificates+"/"].some(prefix=>path.startsWith(prefix)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(path.slice(prefix.length)));
 return document?certificateDocumentPolicy:contentPolicy(nonce);
}
