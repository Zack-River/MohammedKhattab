import { offerBaseAmount } from "@platform/features/commerce/helpers/offer-base-amount";
import { requireIdentity } from "@platform/features/auth/server/identity";
import { ApiError } from "@platform/lib/api/error";
import { findCourse } from "@platform/features/catalog/service";
import { readState } from "./read-state";
export async function enrollCourse(slug: string) {
  const { client, user } = await requireIdentity();
  const course = await findCourse(slug);
  if (!course) throw new ApiError(404, "NOT_FOUND");
  const { data, error: lookupError } = await client.from("enrollment_access").select("course_slug,active,revoked").eq("user_id", user.id).eq("course_slug", slug).maybeSingle();
  if (lookupError) throw new ApiError(503, "INTERNAL_ERROR");
  if (data?.revoked) throw new ApiError(403, "ENROLLMENT_REVOKED");
  if (!data?.active) {
    const verification = await client.rpc("contacts_verified");
    if (verification.error) throw new ApiError(503, "INTERNAL_ERROR");
    if (!verification.data) throw new ApiError(403, "CONTACT_VERIFICATION_REQUIRED");
    if (course.delivery === "live" || course.offer.amountLabel || offerBaseAmount(course.offer) > 0) throw new ApiError(403, "PAYMENT_REQUIRED");
    const { error } = await client.rpc("enroll_free_course", {p_slug: slug});
    if (error && error.code !== "23505") throw new ApiError(503, "INTERNAL_ERROR");
  }
  return readState(client, user);
}
