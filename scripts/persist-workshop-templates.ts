import { createClient } from "@supabase/supabase-js";
import { defaultWorkshopTemplate } from "../modules/features/marketing/templates/default-template";
import { publicCourse } from "../modules/features/catalog/helpers/public-course";
import { validateWorkshopTemplate } from "../modules/features/marketing/templates/helpers/validate-document";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in environment");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching courses from Supabase...");
  const { data: courses, error } = await supabase
    .from("courses")
    .select("slug, metadata, amount, published");

  if (error || !courses) {
    console.error("Failed to query courses:", error);
    process.exit(1);
  }

  console.log(`Found ${courses.length} courses in database.`);

  const { data: existingTemplates } = await supabase
    .from("workshop_templates")
    .select("course_slug, revision");

  const existingMap = new Map<string, number>();
  for (const tpl of existingTemplates ?? []) {
    if (tpl.course_slug) {
      existingMap.set(tpl.course_slug, tpl.revision);
    }
  }

  for (const row of courses) {
    try {
      const course = publicCourse(row.metadata, row.slug, Number(row.amount), {
        draft: !row.published,
      });

      const template = defaultWorkshopTemplate(course, "course");
      const isValid = validateWorkshopTemplate(template, template);

      if (!isValid) {
        console.error(`Generated template for ${row.slug} failed validation, skipping.`);
        continue;
      }

      const currentRev = existingMap.get(row.slug) ?? 0;
      const nextRev = currentRev + 1;

      const payload = {
        course_slug: row.slug,
        bundle_slug: null,
        document: JSON.parse(JSON.stringify(template)),
        revision: nextRev,
        updated_at: new Date().toISOString(),
      };

      const { data, error: upsertError } = await supabase
        .from("workshop_templates")
        .upsert(payload, { onConflict: "course_slug" })
        .select("course_slug, revision");

      if (upsertError) {
        console.error(`Failed to upsert template for ${row.slug}:`, upsertError);
      } else {
        console.log(`✓ Saved template for course [${row.slug}] (rev ${nextRev}) with ${template.content.clients.reels?.length} reels and title "${template.content.clients.reelsTitle}".`);
      }
    } catch (err) {
      console.error(`Error processing course ${row.slug}:`, err);
    }
  }

  console.log("\nVerifying workshop_templates in Supabase...");
  const { data: finalTemplates, error: finalError } = await supabase
    .from("workshop_templates")
    .select("course_slug, revision, updated_at");

  if (finalError) {
    console.error("Verification query error:", finalError);
  } else {
    console.log("Current workshop_templates in Supabase:");
    console.table(finalTemplates);
  }
}

run();
