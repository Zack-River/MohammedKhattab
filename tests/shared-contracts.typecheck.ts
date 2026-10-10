import type { MenuDismissalOptions } from "@khatab/design/hooks/use-menu-dismissal";
import type { ScrollRevealHookOptions } from "@khatab/design/hooks/use-scroll-reveals";
import type { NativeSubscriptionOptions } from "@khatab/design/helpers/media/native/subscribe";
import type { LessonOutlineOptions } from "@platform/features/learning/helpers/lesson-outline";
import type { MobileMenuOptions } from "@khatab/design/hooks/use-mobile-menu";
/** Required ownership and domain dependencies must stay explicit as optional settings grow. */
export function verifySharedContracts() {
  // @ts-expect-error a dismissal lifecycle needs an owner and close action
  const menu: MenuDismissalOptions = { open: true };
  // @ts-expect-error a reveal lifecycle cannot infer which page owns its elements
  const reveal: ScrollRevealHookOptions = { enabled: true };
  // @ts-expect-error publication cannot be omitted from a native subscription
  const native: NativeSubscriptionOptions = { video: {} as HTMLVideoElement, sourceUrl: "demo.mp4" };
  // @ts-expect-error a domain outline cannot supply application routes implicitly
  const outline: LessonOutlineOptions = { course: {} as LessonOutlineOptions["course"], state: {} as LessonOutlineOptions["state"] };
  const defaults: MobileMenuOptions = {};
  const configured: MobileMenuOptions = { breakpointToken: "--custom-breakpoint", initialOpen: true };
  return { menu, reveal, native, outline, defaults, configured };
}
