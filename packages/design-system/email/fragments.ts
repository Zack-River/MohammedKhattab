import { emailVariables } from "./variables";
import type { EmailBrand, EmailContent, EmailTheme } from "./types";
export function escapeEmailText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
export function emailAction(content: EmailContent, theme: EmailTheme, brand: EmailBrand) {
  if (content.code) return `<p dir="ltr" style="font-size:${theme.headingSize};font-weight:700;text-align:center;padding:${theme.gap};border:1px solid ${theme.border};border-radius:${theme.radius}">${content.code}</p>`;
  if (!content.action) return "";
  const url = content.actionUrl ?? emailVariables.confirmationUrl;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:${theme.padding} 0"><tr><td bgcolor="${theme.primary}" style="border-radius:${theme.radius};text-align:center"><a href="${url}" style="display:inline-block;padding:${theme.gap} ${theme.padding};font-family:${escapeEmailText(theme.font)};font-size:${theme.buttonSize};font-weight:700;color:${theme.text};text-decoration:none">${escapeEmailText(content.action)}</a></td></tr></table>
<p style="font-size:${theme.smallSize};color:${theme.secondary}">${escapeEmailText(brand.fallback)}</p><p dir="ltr" style="font-size:${theme.smallSize};word-break:break-all;overflow-wrap:anywhere"><a href="${url}" style="color:${theme.secondary}">${url}</a></p>`;
}
