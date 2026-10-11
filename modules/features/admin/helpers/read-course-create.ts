export function readCourseCreate(form: FormData) {
  return { ...Object.fromEntries(form), amount: Number(form.get("amount")) };
}
