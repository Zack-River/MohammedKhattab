import { requireAdminPage } from "@platform/features/admin/page-identity";
import { readPhoneConfirmations } from "@platform/features/account/repositories/read-phone-confirmations";
import { phoneConfirmationCopy } from "@platform/data/phone-confirmations";
import { accountCopy } from "@platform/data/account";
import { phoneConfirmationConfig } from "@platform/config/phone-confirmations";
import PhoneConfirmations from "@platform/components/admin/phone-confirmations";
export default async function PhoneConfirmationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdminPage();
  const raw = Number((await searchParams).page ?? 1);
  const page = Number.isInteger(raw) && raw > 0 && raw <= phoneConfirmationConfig.maxPage ? raw : 1;
  return <PhoneConfirmations {...await readPhoneConfirmations(page)} page={page} labels={phoneConfirmationCopy} accountLabels={accountCopy} />;
}
