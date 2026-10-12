import { endpoints } from "@platform/config/navigation";
import { securityPolicy as policy } from "@platform/config/security";
export function ratePolicy(path: string, method: string) {
  if (!path.startsWith("/api/")) return { name: "page", ...policy.page };
  if (path === "/api/payments/fawaterak/webhook_json") return { name: "webhook", ...policy.webhook };
  if (method === "GET" || method === "HEAD") return { name: "api", ...policy.api };
  if (/\/auth\/(?:login|signup)$/.test(path)) return { name: "auth", ...policy.auth };
  if (/\/(?:auth\/forgot-password|account\/verification)/.test(path)) return { name: "email", ...policy.email };
  if (path === endpoints.imageUpload) return { name: "upload", ...policy.upload };
  return { name: "mutation", ...policy.mutation };
}
