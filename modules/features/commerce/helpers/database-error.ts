import { ApiError } from "@platform/lib/api/error";
export function commerceDatabaseError(error: {message:string;code?:string}): never {
 const codes: Record<string,number> = {ENROLLMENT_REVOKED:403,COUPON_UNAVAILABLE:400,UNAUTHENTICATED:401,INVALID_BUNDLE_COURSES:400,INVALID_PAYMENT_COURSE:404,COMMERCE_CONFLICT:409,PAYMENT_OVERLAP:409,PAYMENT_PRICE_CHANGED:409,PAYMENT_PRICE_LOCKED:409,ALREADY_ENROLLED:409,PAYMENT_ALREADY_PAID:409,CONTACT_VERIFICATION_REQUIRED:403,INVALID_INPUT:400};
 const code = Object.keys(codes).find(key => error.message.includes(key));
 if (code) throw new ApiError(codes[code],code);
 if (error.code === "23505") throw new ApiError(409,"COMMERCE_DUPLICATE");
 if (error.code === "23503") throw new ApiError(409,"COMMERCE_IN_USE");
 if (error.code === "23514" || error.code === "22P02") throw new ApiError(400,"INVALID_INPUT");
 throw new ApiError(503,"INTERNAL_ERROR");
}
