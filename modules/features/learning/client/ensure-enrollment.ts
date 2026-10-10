export async function ensureEnrollment({ slug, enrolled, enroll }: {
  slug: string; enrolled: boolean; enroll: (slug: string) => Promise<unknown>;
}) {
  if (!enrolled) await enroll(slug);
}
