import "server-only";
import { paymentEnvironment } from "./environment";
import { readGatewayEnvelope } from "../helpers/read-gateway-envelope";
import { paymentToken } from "./token";
import { ApiError } from "@platform/lib/api/error";
export async function gatewayRequest(path: "createTransaction" | "getTransactionData", body: unknown) {
  try {
    const origin = paymentEnvironment().origin;
    for (let attempt = 0; attempt < 2; attempt++) {
      const token = await paymentToken(attempt === 1);
      const response = await fetch(`${origin}/api/v3/${path}`, {
        method: "POST",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status === 401 && attempt === 0) continue;
      if (!response.ok) throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
      return readGatewayEnvelope(await response.json());
    }
  } catch {
    throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
  }
  throw new ApiError(503, "PAYMENTS_UNAVAILABLE");
}
