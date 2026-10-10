export interface CertificateModel {
  brandName: string;
  brandEnglishName: string;
  learnerName: string;
  courseTitle: string;
  title: string;
  disclaimer: string;
}
export interface CertificatePresentation {
  colors: { primary: string; background: string; text: string };
  fontBase64: string;
}
const escapeXml = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (char) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[char]!,
  );
export function renderCertificate(
  model: CertificateModel,
  presentation: CertificatePresentation,
) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="850" viewBox="0 0 1200 850"><rect width="1200" height="850" fill="${presentation.colors.background}"/><rect x="35" y="35" width="1130" height="780" rx="14" fill="none" stroke="${presentation.colors.primary}" stroke-width="2"/><style>@font-face{font-family:CertificateArabic;src:url(data:font/ttf;base64,${presentation.fontBase64}) format('truetype');font-weight:700;}</style><g font-weight="700" text-anchor="middle" fill="${presentation.colors.text}" font-family="CertificateArabic"><text x="600" y="150" font-size="44">${escapeXml(model.brandName)} / ${escapeXml(model.brandEnglishName)}</text><text x="600" y="285" font-size="40">${escapeXml(model.title)}</text><text x="600" y="400" font-size="48">${escapeXml(model.learnerName)}</text><text x="600" y="505" font-size="30">${escapeXml(model.courseTitle)}</text><text x="600" y="650" font-size="24">${escapeXml(model.disclaimer)}</text></g></svg>`;
}
