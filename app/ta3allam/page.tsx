import { listCourses } from "@platform/features/catalog";
import { createLandingModel } from "@platform/features/marketing/landing";
import type { Metadata } from "next";
import { Landing } from "@platform/features/marketing";
import { interfaceCopy } from "@platform/data/interface-copy";
export const metadata: Metadata = {
  title: { absolute: interfaceCopy.metadataTitle },
  description: interfaceCopy.metadataDescription,
};
export default async function Ta3llamPage() {
  return <Landing model={createLandingModel(await listCourses())} />;
}
