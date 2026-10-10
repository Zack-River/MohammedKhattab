import Action from "@khatab/design/ui/action";
import EmptyState from "../../modules/components/ui/empty-state";
import Symbol from "../../modules/components/ui/symbol";
import type {Course} from "../../modules/types/lms";
/** Compile-only negative contracts; unexpected acceptance fails TypeScript. */
export function verifyTypeContracts(course:Course){
 // @ts-expect-error a navigation action cannot be an unlabeled empty-state link
 const empty=<EmptyState title="EMPTY" description="BODY" href="/ta3allam/courses"/>;
 // @ts-expect-error a button cannot receive a navigation destination
 const button=<Action kind="button" href="/ta3allam/courses">START</Action>;
 // @ts-expect-error icon names are a closed product vocabulary
 const icon=<Symbol name="unknown"/>;
 // @ts-expect-error published artwork kinds are exhaustive
 const artwork:Course={...course,artwork:"unknown"};
 return {empty,button,icon,artwork};
}
