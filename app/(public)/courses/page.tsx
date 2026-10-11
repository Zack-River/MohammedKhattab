import { routes } from "@platform/config/navigation";
import { categories } from "@platform/data/courses";
import { site } from "@platform/data/site";
import { offerCopy } from "@platform/data/offers";
import { interfaceCopy } from "@platform/data/interface-copy";
import { Suspense } from "react";
import CatalogFilters from "@platform/components/courses/catalog-filters";
import CourseGrid from "@platform/components/courses/course-grid";
import EmptyState from "@platform/components/ui/empty-state";
import PageHeading from "@platform/components/ui/page-heading";
import { listCourses } from "@platform/features/catalog";
import { copy } from "@platform/data/site";
export const metadata = { title: interfaceCopy.courseBreadcrumb };
export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const search = await searchParams;
  const q = typeof search.q === "string" ? search.q : "";
  const category =
    typeof search.category === "string" ? search.category : "all";
  const courses = await listCourses(q, category);
  return (
    <main className="lms-public-main container">
      <PageHeading
        title={copy.coursesTitle}
        description={copy.coursesDescription}
      />
      <Suspense>
        <CatalogFilters
          interfaceCopy={{ categoryLabel: interfaceCopy.categoryLabel }}
          categories={categories}
          copy={{ search: copy.search, searchButton: copy.searchButton }}
          query={q}
          category={category}
        />
      </Suspense>
      <div className="lms-results-meta">
        <span>
          {courses.length} {interfaceCopy.catalogTitle}
        </span>
        <span>{interfaceCopy.catalogDemoLabel}</span>
      </div>
      {courses.length ? (
        <CourseGrid
          copy={{
            lessons: copy.lessons,
            continue: copy.continue,
            progress: copy.progress,
          }}
          site={{ englishName: site.englishName }}
          offerCopy={{ price: offerCopy.price }}
          courses={courses}
        />
      ) : (
        <EmptyState
          title={copy.noResults}
          description={copy.noResultsBody}
          href={routes.courses}
          label={copy.reset}
        />
      )}
    </main>
  );
}
