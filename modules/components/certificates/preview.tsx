/* eslint-disable @next/next/no-img-element -- Same-origin authenticated SVG with embedded Arabic font. */
import type {CertificateLabels} from "@platform/types/certificates";
export default function CertificatePreview({src,labels}:{src:string;labels:CertificateLabels}) {
 return <details className="lms-profile-card lms-certificate-preview" data-reveal data-reveal-motion="fade"><summary className="lms-text-link">{labels.preview}</summary><p className="lms-field-hint">{labels.previewHint}</p><img src={src} alt={labels.preview} width={1200} height={850} loading="lazy" decoding="async"/></details>;
}
