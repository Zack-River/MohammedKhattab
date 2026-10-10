type Widen<T> = T extends string ? string : T extends (infer I)[] ? Widen<I>[] : T extends readonly (infer I)[] ? readonly Widen<I>[] : T extends object ? { [K in keyof T]: K extends "id" | "symbol" ? T[K] : Widen<T[K]> } : T;
export interface ContentBindings {
 interfaceCopy: Widen<typeof import("@platform/data/interface-copy").interfaceCopy>;
 copy: Widen<typeof import("@platform/data/site").copy>;
 categories: Widen<typeof import("@platform/data/courses").categories>;
 site: Widen<typeof import("@platform/data/site").site>;
 offerCopy: Widen<typeof import("@platform/data/offers").offerCopy>;
 dashboardNavigation: readonly { href: string; label: string; symbol: import("@platform/components/ui/symbol").SymbolName }[];
 marketingNavigation: Widen<typeof import("@platform/data/site").marketingNavigation>;
 courses: typeof import("@platform/data/courses").courses;
}
