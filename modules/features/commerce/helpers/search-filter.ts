/** Quotes no PostgREST grammar: accepts letters, numbers and names, escaping LIKE wildcards. */
export function commerceSearchFilter(search:string,identifier:'key' | 'slug') {
 const value=search.replace(/[^\p{L}\p{N} _-]/gu,'').replaceAll('_','\\_');
 return `title.ilike.%${value}%,${identifier}.ilike.%${value}%`;
}
