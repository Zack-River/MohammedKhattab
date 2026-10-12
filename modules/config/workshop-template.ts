import { workshopSectionKeys as sharedSectionKeys } from "@khatab/design/types/marketing";
export const workshopSectionKeys=sharedSectionKeys;
export const templatePolicy = { maxBytes: 96 * 1024, maxRequestBytes: 128 * 1024, maxItems: 40, maxDepth: 14, maxString: 6000 } as const;
export const templateLockedFields = new Set(["section", "className", "icon", "kind", "controlsVariant", "returnToPosterOnEnd", "key", "platform"]);

export const isTemplateEndpoint=(path:string)=>/^\/api\/admin\/(?:courses|commerce\/bundles)\/[a-z0-9]+(?:-[a-z0-9]+)*\/template$/.test(path);

export const templateContentKeys=[...workshopSectionKeys,"footer"] as const;
