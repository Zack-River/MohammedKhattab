"use client";
import {useHydrated} from "@khatab/design/hooks/use-hydrated";
export default function CertificatePrintButton({label}:{label:string}) {
 const hydrated=useHydrated();return <button type="button" className="btn-primary lms-print-action" disabled={!hydrated} onClick={()=>window.print()}>{label}</button>;
}
