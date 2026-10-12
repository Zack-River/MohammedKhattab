import type { MarketingPageContent,WorkshopSectionKey } from "@khatab/design/types/marketing";
export type { WorkshopSectionKey } from "@khatab/design/types/marketing";
export type TemplateContent = Pick<MarketingPageContent, WorkshopSectionKey | "footer" | "signup" | "offer"> & { scarcity: Pick<MarketingPageContent["header"], "scarcityLabel" | "viewerCount" | "viewerLabel" | "countdown"> };
export interface WorkshopTemplate { content: TemplateContent; order: WorkshopSectionKey[]; showCountdown: boolean; showSignup: boolean; }
export interface TemplateRecord { document: WorkshopTemplate; revision: number; }
export type TemplateValue = string | number | boolean | null | TemplateValue[] | { [key: string]: TemplateValue };
