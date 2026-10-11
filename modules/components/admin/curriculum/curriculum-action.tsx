"use client";
import { useState } from "react";
import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import CurriculumDialog from "./curriculum-dialog";
export default function CurriculumAction({ context, target, label }: { context: CurriculumContext; target: CurriculumTarget; label: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={target.operation === "delete" ? "lms-admin-danger" : "lms-secondary-button"} onClick={() => setOpen(true)}>{label}</button>
    {open && <CurriculumDialog context={context} target={target} onClose={() => setOpen(false)} />}
  </>;
}
