import { ApiError } from "@platform/lib/api/error";
/** A deadline covers the entire body, including stalled/chunked clients. */
export async function readStream(reader: ReadableStreamDefaultReader<Uint8Array>, maxBytes: number, signal: AbortSignal) {
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    signal.throwIfAborted();
    const result = await abortableRead(reader, signal);
    if (result.done) return { chunks, length };
    length += result.value.byteLength;
    if (length > maxBytes) throw new ApiError(413, "REQUEST_TOO_LARGE");
    chunks.push(result.value);
  }
}
function abortableRead(reader: ReadableStreamDefaultReader<Uint8Array>, signal: AbortSignal) {
  return new Promise<ReadableStreamReadResult<Uint8Array>>((resolve, reject) => {
    const abort = () => reject(new ApiError(408, "REQUEST_TIMEOUT"));
    signal.addEventListener("abort", abort, { once: true });
    reader.read().then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
    if (signal.aborted) abort();
  });
}
