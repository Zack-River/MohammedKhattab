import "server-only";
import font from "../../styles/certificate-font.json";
import { theme } from "@platform/lib/theme";
import type { CertificatePresentation } from "./renderer";
export const certificatePresentation: CertificatePresentation = {
  colors: theme,
  fontBase64: font.base64,
};
