import { WorkshopPage } from "@/app/components/workshop";
import { workshopPage } from "@/app/data/workshop";
import { workshopMetadata } from "@/app/config/workshop-metadata";
export const metadata = workshopMetadata;
export default function FreelanceWorkshopPage() {
  return <WorkshopPage content={workshopPage} />;
}
