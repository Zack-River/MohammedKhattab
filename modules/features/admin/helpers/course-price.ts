import { adminCoursePolicy } from "@platform/config/admin";
export function validCourseAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= adminCoursePolicy.amountMax;
}
export function normalizeCoursePrice(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, digit => String(digit.charCodeAt(0) - (digit >= "۰" ? 1776 : 1632)));
}
export function validPaidPriceInput(value: string) {
  return value === "" || (/^[1-9][0-9]*$/.test(value) && validCourseAmount(Number(value)));
}
