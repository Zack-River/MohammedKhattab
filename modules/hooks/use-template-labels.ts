"use client";
import { createContext,useContext } from "react";
import type { templateCopy } from "@platform/data/workshop-template";
export interface TemplateLabels { copy:typeof templateCopy; fields:Record<string,string>; }
export const TemplateLabelsContext=createContext<TemplateLabels | null>(null);
export function useTemplateLabels() {
 const labels=useContext(TemplateLabelsContext);
 if(!labels) throw new Error("Template labels provider missing");
 return labels;
}
