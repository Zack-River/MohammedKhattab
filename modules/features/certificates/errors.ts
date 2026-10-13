import {ApiError} from "@platform/lib/api/error";
export function certificateError(message:string) {
 const code=["FORBIDDEN","NOT_FOUND","INVALID_INPUT","CERTIFICATE_CONFLICT","CERTIFICATE_INELIGIBLE","CERTIFICATE_REVOKED"].find(code=>message.includes(code)) ?? "INTERNAL_ERROR";
 return new ApiError(code==="CERTIFICATE_CONFLICT"?409:code==="NOT_FOUND"?404:code==="FORBIDDEN"||code==="CERTIFICATE_INELIGIBLE"||code==="CERTIFICATE_REVOKED"?403:code==="INVALID_INPUT"?400:503,code);
}
