import {recordPolicy} from "./records";
export const certificatePolicy = {...recordPolicy,statuses:["issued","revoked"] as const,reasonMax:500};
/** Isolated SVG documents need embedded fonts, never scripts or external requests. */
export const certificateDocumentPolicy="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
