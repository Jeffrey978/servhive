import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { formatDate, formatNaira } from "@/lib/utils";
import { billingState, boostState, loadPro } from "@/server/pro";
import { paySubscriptionAction } from "@/server/pro-actions";
import { Card, PageHeader } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { ConfirmAction } from "@/components/pro/form-bits";
import { NoProvider } from "@/components/pro/no-provider";
import { ProSection } from "@/components/pro/section";

export default async function ProBillingPage() {
  const { provider } = await loadPro("/pro/billing");
  if (!provider) return <NoProvider />;

  const receipts = await db.billingReceipt.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" }, take: 100 });
  const b = billingState(provider);
  const boost = boostState(provider);
  const example = 50_000;
  const exampleFee = Math.round((example * RULES.commissionPct) / 100);

  return (
    <>
      <PageHeader
        eyebrow="Billing"
        title="Plan & receipts"
        description={`${RULES.freeTrialMonths} months free, then ${formatNaira(RULES.monthlySubscription)} a month. Payments here are in test mode, so no card is charged.`}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="flex flex-col justify-between gap-6 p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="eyebrow">Subscription</p>
              <Badge tone={b.state === "due" ? "danger" : b.state === "trial" ? "accent" : "success"}>
                {b.state === "trial" ? "Free trial" : b.state === "paid" ? "Active" : "Due"}
              </Badge>
            </div>
            <p className="mt-4 text-3xl font-medium tracking-tight">
              {b.state === "trial"
                ? `${b.trialDaysLeft} day${b.trialDaysLeft === 1 ? "" : "s"} left`
                : b.state === "paid"
                  ? `${b.coveredDaysLeft} day${b.coveredDaysLeft === 1 ? "" : "s"} left`
                  : "Payment due"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {b.state === "trial" && b.coveredUntil
                ? b.paidActive && b.paidUntil && provider.trialEndsAt && b.paidUntil > provider.trialEndsAt
                  ? `Trial ends ${formatDate(provider.trialEndsAt)} · paid until ${formatDate(b.paidUntil)}`
                  : `Trial ends ${formatDate(b.coveredUntil)}`
                : b.state === "paid" && b.paidUntil
                  ? `Paid until ${formatDate(b.paidUntil)}`
                  : "Pay to keep your profile visible to clients."}
            </p>
          </div>
          <ConfirmAction
            action={paySubscriptionAction}
            label={`Pay ${formatNaira(RULES.monthlySubscription)} for 1 month`}
            confirmLabel={`Confirm ${formatNaira(RULES.monthlySubscription)}`}
            pendingLabel="Processing…"
            prompt="Test mode."
            variant={b.state === "due" ? "accent" : "outline"}
            confirmVariant="accent"
          />
        </Card>

        <Card className="flex flex-col justify-between gap-6 p-6">
          <div>
            <p className="eyebrow">Boost</p>
            <p className="mt-4 text-3xl font-medium tracking-tight">{boost.active ? `${boost.daysLeft} day${boost.daysLeft === 1 ? "" : "s"} left` : "Off"}</p>
            <p className="mt-1 text-sm text-muted">
              {boost.active && boost.until ? `Top of search until ${formatDate(boost.until)}` : `${formatNaira(RULES.boostPricePerWeek)} per week, from your overview.`}
            </p>
          </div>
        </Card>
      </div>

      <ProSection n="01" title="Receipts">
        {receipts.length === 0 ? (
          <p className="text-sm text-muted">No payments yet. You&apos;re on the free trial.</p>
        ) : (
          <div className="border-y border-border">
            <div className="hidden grid-cols-[8rem_1fr_7rem_6rem] gap-4 border-b border-border py-2.5 md:grid">
              <span className="eyebrow">Date</span>
              <span className="eyebrow">Description</span>
              <span className="eyebrow text-right">Amount</span>
              <span className="eyebrow text-right">Status</span>
            </div>
            <ul className="divide-y divide-border">
              {receipts.map((r) => (
                <li key={r.id} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-3.5 md:grid-cols-[8rem_1fr_7rem_6rem] md:items-center">
                  <span className="order-2 text-sm text-muted md:order-none">{formatDate(r.createdAt)}</span>
                  <span className="order-1 min-w-0 md:order-none">
                    <span className="block truncate text-[0.9375rem]">{r.description}</span>
                    <span className="block font-mono text-xs text-muted">{r.ref}</span>
                  </span>
                  <span className="order-1 text-right tabular-nums md:order-none">{formatNaira(r.amount)}</span>
                  <span className="order-2 text-right md:order-none">
                    <Badge tone={r.status === "PAID" ? "success" : "neutral"}>{r.status === "PAID" ? "Paid" : r.status}</Badge>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </ProSection>

      <ProSection n="02" title={`The ${RULES.commissionPct}% fee`}>
        <p className="max-w-xl text-[0.9375rem] leading-relaxed">
          Servhive keeps {RULES.commissionPct}% of each job paid through escrow. It covers payment protection, dispute handling and
          ID checks. Nothing is charged on quotes that aren&apos;t accepted.
        </p>
        <dl className="mt-6 max-w-sm divide-y divide-border border-y border-border text-sm">
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Client pays</dt>
            <dd className="tabular-nums">{formatNaira(example)}</dd>
          </div>
          <div className="flex justify-between py-2.5">
            <dt className="text-muted">Servhive fee ({RULES.commissionPct}%)</dt>
            <dd className="tabular-nums">−{formatNaira(exampleFee)}</dd>
          </div>
          <div className="flex justify-between py-2.5 font-medium">
            <dt>You receive</dt>
            <dd className="tabular-nums">{formatNaira(example - exampleFee)}</dd>
          </div>
        </dl>
      </ProSection>
    </>
  );
}
