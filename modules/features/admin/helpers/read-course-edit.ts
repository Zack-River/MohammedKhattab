export function readCourseEdit(form: FormData) {
  return { revision: Number(form.get("revision")), title: form.get("title"), description: form.get("description"), amount: Number(form.get("amount")), category: form.get("category"), ...(form.has("duration") ? { duration: form.get("duration") } : {}),
    thumbnailUrl: form.get("thumbnailUrl"), introVideoUrl: form.get("introVideoUrl"), published: form.get("published") === "on" };
}
