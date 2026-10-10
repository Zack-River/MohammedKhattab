export function driveFileId(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.hostname !== "drive.google.com") return null;
    const id = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] ?? url.searchParams.get("id");
    return id && /^[\w-]{8,200}$/.test(id) ? id : null;
  } catch { return null; }
}
