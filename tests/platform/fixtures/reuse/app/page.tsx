import { courses } from "@platform/data/courses";
import { createLandingModel } from "@platform/features/marketing/landing";
import Fixture from "./reuse-fixture";
export default function Page() {
  return <Fixture model={createLandingModel(courses)} />;
}
