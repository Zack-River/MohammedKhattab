import { fetchDrive } from "@platform/lib/security/drive-fetch";
import { validMediaRange } from "@platform/lib/security/media-range";
import "server-only";
import { driveFileId } from "@platform/helpers/media/drive-file-id";
import { ApiError } from "@platform/lib/api/error";
export async function streamDrive(url: string, request: Request) {
  const id = driveFileId(url);
  if (!id) throw new ApiError(404,"NOT_FOUND");
  const range = request.headers.get("range");
  if (range && !validMediaRange(range)) throw new ApiError(400,"INVALID_INPUT");
  const response = await fetchDrive(new URL(`https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`),
    range ? { Range: range } : {}, request.signal);
  if (!response.ok || !/^(video\/|application\/octet-stream)/i.test(response.headers.get("content-type") ?? "")) {
    void response.body?.cancel().catch(() => undefined); throw new ApiError(503,"MEDIA_UNAVAILABLE");
  }
  const headers = new Headers({ "Content-Type": response.headers.get("content-type") === "application/octet-stream" ? "video/mp4" : response.headers.get("content-type")!, "Cache-Control": "private, no-store" });
  for (const name of ["Content-Length","Content-Range","Accept-Ranges"]) { const value = response.headers.get(name); if (value) headers.set(name,value); }
  return new Response(response.body, { status: response.status, headers });
}
