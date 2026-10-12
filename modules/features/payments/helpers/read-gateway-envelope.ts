import { ApiError } from "@platform/lib/api/error";
export function readGatewayEnvelope(result: unknown): Record<string, unknown> {
  if (
    !result ||
    typeof result !== "object" ||
    !("status" in result) ||
    result.status !== "success" ||
    !("data" in result) ||
    !result.data ||
    typeof result.data !== "object"
  )
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  return result.data as Record<string, unknown>;
}
