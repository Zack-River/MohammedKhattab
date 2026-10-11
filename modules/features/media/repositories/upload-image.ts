import "server-only";
import { randomUUID } from "node:crypto";
import { cloudinaryEnvironment } from "@platform/lib/cloudinary/environment";
import { cloudinaryRequest } from "@platform/lib/cloudinary/request";
import { imageUploadPolicy as policy } from "@platform/config/image-upload";
import { readUploadedImage } from "../helpers/read-uploaded-image";
export async function uploadImage(file: File, folder: string, avatar: boolean) {
  const { root } = cloudinaryEnvironment(), assetFolder = `${root}/${folder}`, publicId = `${assetFolder}/${randomUUID()}`;
  const value = await cloudinaryRequest("upload", { asset_folder: assetFolder, public_id: publicId, overwrite: "false", allowed_formats: policy.formats, transformation: avatar ? policy.avatarTransform : policy.thumbnailTransform }, file);
  const image = readUploadedImage({ url: value.secure_url, publicId: value.public_id, width: value.width, height: value.height });
  if (image.publicId !== publicId) throw new Error("Unexpected image identifier");
  return { ...image, url: image.url.replace("/image/upload/", "/image/upload/f_auto,q_auto/") };
}
