import { routes } from "@platform/config/navigation";
import type { ContentBindings } from "@platform/types/content";

import Link from "next/link";
import Symbol from "@platform/components/ui/symbol";
export default function CatalogFilters({
  query,
  category,
  interfaceCopy,
  categories,
  copy,
}: {
  query: string;
  category: string;
} & {
  interfaceCopy: Pick<ContentBindings["interfaceCopy"], "categoryLabel">;
  categories: ContentBindings["categories"];
  copy: Pick<ContentBindings["copy"], "search" | "searchButton">;
}) {
  return (
    <div className="lms-catalog-controls">
      <form action={routes.courses} className="lms-search" role="search">
        <Symbol name="search" />
        <input
          name="q"
          type="search"
          defaultValue={query}
          aria-label={copy.search}
          placeholder={copy.search}
        />
        <input type="hidden" name="category" value={category} />
        <button type="submit">{copy.searchButton}</button>
      </form>
      <div className="lms-filter-tabs" aria-label={interfaceCopy.categoryLabel}>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={routes.catalog(query, item.id)}
            aria-current={category === item.id ? "page" : undefined}
            className={category === item.id ? "is-active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
