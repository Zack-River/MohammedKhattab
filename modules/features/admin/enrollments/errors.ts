import {ApiError} from "@platform/lib/api/error";
export function enrollmentError(message:string):never {
 const code=["ENROLLMENT_CONFLICT","ENROLLMENT_REVOKED","CONTACT_VERIFICATION_REQUIRED","FORBIDDEN","NOT_FOUND","INVALID_INPUT"].find(code=>message.includes(code));
 throw new ApiError(code==="ENROLLMENT_CONFLICT"||code==="ENROLLMENT_REVOKED"?409:code==="NOT_FOUND"?404:code==="FORBIDDEN"||code==="CONTACT_VERIFICATION_REQUIRED"?403:code?400:503,code??"INTERNAL_ERROR");
}
