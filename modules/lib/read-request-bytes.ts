import { securityPolicy } from "@platform/config/security";
import { ApiError } from "@platform/lib/api/error";
import { readStream } from "./security/read-stream";
/** Size and time bounded even when Content-Length is absent or forged. */
export async function readRequestBytes(request: Request, maxBytes: number, timeoutMs: number = securityPolicy.bodyTimeoutMs): Promise<Uint8Array | null> {
  if (!request.body) return null;
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) throw new ApiError(413, "REQUEST_TOO_LARGE");
  const reader = request.body.getReader();
  const signal = AbortSignal.any([request.signal, AbortSignal.timeout(timeoutMs)]);
  try {
    const { chunks, length: size } = await readStream(reader, maxBytes, signal);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return bytes;
  } catch (error) {
    // Cancellation may itself stall; never await an untrusted source's cancel hook.
    void reader.cancel().catch(() => undefined);
    if (signal.aborted) throw new ApiError(408, "REQUEST_TIMEOUT");
    throw error;
  } finally { reader.releaseLock(); }
}
