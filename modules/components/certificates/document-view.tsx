/* eslint-disable @next/next/no-img-element -- Protected printable SVG with embedded Arabic font. */
import CertificatePrintButton from "./print-button";
export default function CertificateDocumentView({src,title,printLabel}:{src:string;title:string;printLabel:string}) {
 return <section className="lms-certificate-document"><img src={src} alt={title} width={1200} height={850} decoding="async"/><CertificatePrintButton label={printLabel}/></section>;
}
