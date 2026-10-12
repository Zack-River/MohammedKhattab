import type { CourseOffer } from "@platform/types/lms";
/** A zero-priced promotion still goes through verified checkout instead of free-course enrollment. */
export function offerBaseAmount(offer:CourseOffer) { return offer.baseAmount ?? offer.amount; }
