export function decodeCourseCreated(value: unknown, errorLabel: string): string {
  if (!value || typeof value !== "object" || !("slug" in value) || typeof value.slug !== "string") throw new Error(errorLabel);
  return value.slug;
}
