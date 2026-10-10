import { HttpError } from "./http-error";
export interface HttpRequestOptions<T> {
  path: string; body: unknown; failureLabel: string;
  decode: (input: unknown) => T;
  fetcher?: typeof fetch; signal?: AbortSignal;
}
export async function httpRequest<T>({ path, body, failureLabel, decode, fetcher = fetch, signal }: HttpRequestOptions<T>): Promise<T> {
  const response = await fetcher(path, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body), signal,
  }).catch(() => { throw new Error(failureLabel); });
  const data: unknown = await response.json().catch(() => { throw new Error(failureLabel); });
  if (!response.ok) {
    const error = data && typeof data === "object" && "error" in data ? data.error : undefined;
    throw new HttpError(response.status, typeof error === "string" ? error : failureLabel);
  }
  return decode(data);
}
