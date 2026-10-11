import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";
import { resolve } from "node:path";
const require = createRequire(resolve("package.json"));
const { inspect, collect } = require("./scripts/architecture-boundaries.cjs");
test("T02 T04 guards cover the unified application and shared source", () => {
  const files = collect([
    "app",
    "modules/components",
    "modules/config",
    "modules/data",
    "modules/features",
    "modules/hooks",
    "modules/helpers",
    "modules/lib",
    "modules/styles",
    "modules/types",
    "config",
    "packages/design-system",
  ]);
  expect(files.length).toBeGreaterThan(150);
  expect(inspect(files)).toEqual([]);
});
test("T35 guard rejects injected boundary violations", () => {
  const violations = inspect([
    [
      "modules/components/ui/fixture.tsx",
      'import {courses} from "@platform/data/courses";',
    ],
    [
      "modules/features/learning/helpers/course-progress.ts",
      'import {cookies} from "next/headers";',
    ],
    [
      "packages/design-system/ui/fixture.tsx",
      'import {demo} from "@/app/features/example";',
    ],
    ["modules/styles/fixture.css", ".card {transition: all 1s;}"],
  ]);
  expect(violations).toHaveLength(4);
  expect(
    inspect([
      [
        "modules/components/fixture.tsx",
        'import type {Course} from "@platform/types/lms";',
      ],
      [
        "modules/features/catalog/service.ts",
        'import {courses} from "@platform/data/courses";',
      ],
    ]),
  ).toEqual([]);
});

test("T35 transitive imports, cycles and each planned ownership mutation are rejected", () => {
  const fixtures: [string, string][][] = [
    [["modules/components/ui/card.tsx", 'import {courses} from "@platform/data/courses";']],
    [
      [
        "modules/components/client.tsx",
        '"use client";import {read} from "../lib/barrel";',
      ],
      [
        "modules/lib/barrel.ts",
        'export {read} from "../features/learning/service";',
      ],
      [
        "modules/features/learning/service.ts",
        'import {cookies} from "next/headers";',
      ],
    ],
    [["modules/styles/copy.css", ":root{--primary-red:#ff0000;}"]],
    [
      [
        "modules/lib/duplicate.ts",
        "export const course=(slug:string)=>`/courses/${slug}`;",
      ],
    ],
    [
      [
        "modules/app/dashboard/page.tsx",
        'export default function Page(){return <article className="lms-course-card"/>;}',
      ],
    ],
    [
      ["modules/lib/a.ts", 'import "./b";'],
      ["modules/lib/b.ts", 'import "./a";'],
    ],
    [
      [
        "modules/components/client.tsx",
        '"use client"; const load=()=>import("next/headers");',
      ],
    ],
    [
      [
        "modules/components/client.tsx",
        '"use client"; const load=()=>require("node:fs");',
      ],
    ],
  ];
  for (const fixture of fixtures)
    expect(inspect(fixture), fixture[0][0]).not.toEqual([]);
  expect(
    inspect([
      [
        "modules/components/ui/shape.tsx",
        'import type {Course} from "@platform/types/lms"; export const shape=<svg viewBox="0 0 1200 850"/>;',
      ],
    ]),
  ).toEqual([]);
});

test("helper boundaries reject oversized files/functions and server or content leakage", () => {
  const oversizedFunction = `export function calculate() {\n${"  const item = 1;\n".repeat(36)}  return item;\n}`;
  const oversizedFile = `${"export const item = 1;\n".repeat(81)}`;
  expect(inspect([["modules/helpers/example/calculate.ts", oversizedFunction]])).toEqual([
    expect.stringContaining("function exceeds 35 lines"),
  ]);
  expect(inspect([["modules/helpers/example/records.ts", oversizedFile]])).toEqual([
    expect.stringContaining("file exceeds 80 lines"),
  ]);
  expect(inspect([["packages/design-system/helpers/media/leak.ts", 'import {cookies} from "next/headers";']])).toEqual([
    expect.stringContaining("server dependency"),
  ]);
  expect(inspect([["modules/helpers/example/leak.ts", 'import {courses} from "@platform/data/courses";']])).toEqual([
    expect.stringContaining("concrete content dependency"),
  ]);
});

test("shared implementations cannot acquire forwarding copies in either product layer", () => {
  for (const layer of ["app", "modules"]) {
    expect(inspect([[`${layer}/components/ui/container.tsx`, '// legacy adapter\nexport { default } from "@khatab/design/ui/container";']])).toEqual([
      expect.stringContaining("redundant shared forwarding file"),
    ]);
    expect(inspect([[`${layer}/types/ui.ts`, 'export type * from "@khatab/design/types/ui";']])).toEqual([
      expect.stringContaining("redundant shared forwarding file"),
    ]);
    expect(inspect([[`${layer}/styles/workshop.css`, '@import "../../packages/design-system/styles/workshop.css";']])).toEqual([
      expect.stringContaining("redundant shared stylesheet adapter"),
    ]);
  }
});
