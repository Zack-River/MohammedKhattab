import { parsePhoneNumberFromString } from "libphonenumber-js/max";
/** Accept only the requested +country-national format, with real numbering-plan validation. */
export function readPhoneNumber(value: unknown) {
  if (typeof value !== "string" || !/^\+[1-9]\d{0,2}-\d{4,14}$/.test(value)) return null;
  const phone = parsePhoneNumberFromString(value.replace("-", ""));
  if (!phone?.isValid() || value !== `+${phone.countryCallingCode}-${phone.nationalNumber}`) return null;
  return { e164: phone.number, display: value };
}
export function displayPhoneNumber(value: string | null) {
  const phone = value ? parsePhoneNumberFromString(value) : undefined;
  return phone ? `+${phone.countryCallingCode}-${phone.nationalNumber}` : "";
}
