import type { CurriculumContext, CurriculumTarget } from "@platform/types/curriculum";
import CurriculumAction from "./curriculum-action";
export default function EntityActions({ context, target }: { context: CurriculumContext; target: Omit<CurriculumTarget,"operation"> }) {
  return <>
    <CurriculumAction context={context} target={{ ...target, operation: "edit" }} label={context.labels.edit} />
    <CurriculumAction context={context} target={{ ...target, operation: "delete" }} label={context.labels.remove} />
  </>;
}
