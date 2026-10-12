export function readCourseCreate(form: FormData) {
  return { ...Object.fromEntries(form), ...(form.has("featured") ? { featured: form.getAll("featured").includes("on") } : {}), amount: Number(form.get("amount")) };
}
