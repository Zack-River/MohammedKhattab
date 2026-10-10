export function readCourseEdit(form: FormData) {
  return { title: form.get("title"), description: form.get("description"), amount: Number(form.get("amount")), category: form.get("category"),
    thumbnailUrl: form.get("thumbnailUrl"), introVideoUrl: form.get("introVideoUrl"), published: form.get("published") === "on" };
}
