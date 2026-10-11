import type { accountCopy } from "@platform/data/account";
export type AccountLabels = { [K in keyof typeof accountCopy]: string };
