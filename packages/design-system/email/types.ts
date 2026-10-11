export interface EmailContent {
  id: string; label: string; subject: string; title: string; message: string; notice: string;
  action?: string; actionUrl?: string; detail?: string; code?: string;
}
export interface EmailBrand {
  name: string; englishName: string; supportEmail: string; supportUrl: string; context: string;
  recipient: string; help: string; support: string; footer: string; fallback: string;
}
export type EmailTheme = Record<"background" | "surface" | "primary" | "text" | "secondary" | "border" | "font" | "width" | "padding" | "gap" | "radius" | "bodySize" | "headingSize" | "buttonSize" | "smallSize", string>;
