import {recordPolicy} from "@platform/config/records";
export function validRecordRevision(value:unknown,existing=true):value is number {
 return typeof value==="number"&&Number.isSafeInteger(value)&&value>=(existing ? 1 : 0)&&value<=recordPolicy.revisionMax;
}
