import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { loadPro, maskAccount } from "@/server/pro";
import { savePayoutAction } from "@/server/pro-actions";
import { Card, PageHeader } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { NoProvider } from "@/components/pro/no-provider";
import { PayoutForm } from "@/components/pro/payout-form";
import { ProSection } from "@/components/pro/section";

export default async function ProPayoutPage() {
  const { provider } = await loadPro("/pro/payout");
  if (!provider) return <NoProvider />;

  const account = await db.payoutAccount.findUnique({ where: { providerId: provider.id } });

  return (
    <>
      <PageHeader
        eyebrow="Payout"
        title="Where we pay you"
        description={`Released escrow payments go to this account, minus the ${RULES.commissionPct}% Servhive fee.`}
      />

      {account ? (
        <Card className="mb-10 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">{account.bankName}</p>
            <p className="mt-2 font-mono text-2xl tracking-wider">{maskAccount(account.accountNumber)}</p>
            <p className="mt-1 truncate text-sm text-muted">{account.accountName}</p>
          </div>
          <Badge tone={account.verified ? "success" : "outline"}>{account.verified ? "Verified" : "Pending verification"}</Badge>
        </Card>
      ) : null}

      <ProSection n="01" title={account ? "Change account" : "Add account"}>
        <PayoutForm action={savePayoutAction} initial={account ? { bankCode: account.bankCode, accountName: account.accountName } : null} />
      </ProSection>
    </>
  );
}
