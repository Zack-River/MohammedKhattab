import { ApiError } from "@platform/lib/api/error";
export function readAdminPage(value?: string | null) {
  if (value == null) return 1;
  if (!/^[1-9][0-9]{0,5}$/.test(value)) throw new ApiError(400, "INVALID_INPUT");
  return Number(value);
}
