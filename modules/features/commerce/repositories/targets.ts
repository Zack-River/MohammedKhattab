import "server-only";
import { createAuthAdministrator } from "@platform/lib/supabase/admin";
import { commerceDatabaseError } from "../helpers/database-error";
/** Editors need identifiers and names, not every course's full curriculum. */
export async function readCommerceTargets() {
 const client=createAuthAdministrator();
 const [courses,bundles]=await Promise.all([
  client.from('courses').select('slug,title:metadata->>title').order('position'),
  client.from('commerce_bundles').select('slug,title').order('title'),
 ]);
 if(courses.error) commerceDatabaseError(courses.error);
 if(bundles.error) commerceDatabaseError(bundles.error);
 return {courses:(courses.data ?? []).map(row=>({slug:row.slug,title:row.title ?? row.slug})),bundles:bundles.data ?? []};
}
