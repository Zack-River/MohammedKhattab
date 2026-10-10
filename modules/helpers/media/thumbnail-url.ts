import { driveFileId } from "./drive-file-id";
export function thumbnailUrl(value: string) {
  const id = driveFileId(value);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1280` : value;
}
