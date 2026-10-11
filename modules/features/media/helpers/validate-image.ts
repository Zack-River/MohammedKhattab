import { ApiError } from "@platform/lib/api/error";
/** Check content signatures as well as the browser-declared MIME; Cloudinary decodes it again. */
export async function validateImage(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const png = bytes.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value);
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const text = new TextDecoder().decode(bytes), webp = text.startsWith("RIFF") && text.slice(8, 12) === "WEBP";
  if (!(png && file.type === "image/png" || jpeg && file.type === "image/jpeg" || webp && file.type === "image/webp")) throw new ApiError(400, "INVALID_IMAGE");
}
