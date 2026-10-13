import {validRecordRevision} from "@platform/helpers/valid-record-revision";
import {enrollmentPolicy} from "@platform/config/enrollment";
import {commercePolicy} from "@platform/config/commerce";
import type {AccessGrant} from "@platform/types/access-grant";
const slug=(value:unknown):value is string=>typeof value==="string"&&value.length<=100&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
export function validateAccessGrant(value:unknown):AccessGrant|null {
 if(!value||typeof value!=="object") return null;
 const v=value as Record<string,unknown>,r=v.revisions;
 if(v.action!=="grant"||(v.kind!=="course"&&v.kind!=="bundle"&&v.kind!=="all")||!slug(v.slug)||typeof v.reason!=="string"||!v.reason.trim()||v.reason.length>enrollmentPolicy.reasonMax||!r||typeof r!=="object"||Array.isArray(r)) return null;
 const entries=Object.entries(r);if((v.kind==="all"?v.slug!=="all"||JSON.stringify(r).length>enrollmentPolicy.revisionsMaxBytes:!entries.length||entries.length>commercePolicy.maxCourses)||entries.some(([key,revision])=>!slug(key)||!validRecordRevision(revision,false))) return null;
 if(v.expiresAt!==null&&(typeof v.expiresAt!=="string"||!/^\d{4}-\d{2}-\d{2}T/.test(v.expiresAt)||!Number.isFinite(Date.parse(v.expiresAt))||Date.parse(v.expiresAt)<=Date.now()||Date.parse(v.expiresAt)>Date.now()+enrollmentPolicy.maxDays*86400000)) return null;
 return {kind:v.kind,slug:v.slug,reason:v.reason.trim(),expiresAt:v.expiresAt as string|null,revisions:Object.fromEntries(entries)};
}
