import Link from "next/link";
import Form from "next/form";
import { requireRole } from "@/lib/auth";
import { autoReleaseDueJobs } from "@/server/escrow";
import { JOB_STATUSES, listLedger, pageOf, pick, PAGE_SIZE, str } from "@/server/admin";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { FilterTabs, Kpi, Pager, Table, Td, Tr, withParams } from "@/components/admin/table";
import { formatDate, formatNaira } from "@/lib/utils";
import { RULES } from "@/lib/constants";

export const metadata = { title: "Escrow ledger" };

const STATUS_LABEL = {
  FUNDED: "In escrow",
  AWAITING_RELEASE: "Awaiting release",
  DISPUTED: "Disputed",
  RELEASED: "Paid out",
  REFUNDED: "Refunded",
} as const;
const short: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

export default async function EscrowLedgerPage({ searchParams }: PageProps<"/admin/escrow">) {
  await requireRole("ADMIN", "/admin/escrow");
  await autoReleaseDueJobs();
  const sp = await searchParams;
  const q = str(sp.q);
  const status = pick(sp.status, JOB_STATUSES);
  const page = pageOf(sp.page);
  const { rows, total, totals, counts } = await listLedger({ q, status, page });
  const all = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Payments · test mode"
        title="Escrow ledger"
        description={`Every job funded through Servhive. Commission is ${RULES.commissionPct}% of the job amount, taken on release.`}
        actions={
          <a href={withParams("/admin/escrow/export", { q, status })} className={buttonVariants({ variant: "outline", size: "sm" })} download>
            Export CSV
          </a>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Held" value={formatNaira(totals.held)} hint={`${totals.heldJobs} active ${totals.heldJobs === 1 ? "job" : "jobs"}`} />
        <Kpi label="Released" value={formatNaira(totals.released)} hint={`${formatNaira(totals.paidOut)} to artisans`} />
        <Kpi label="Refunded" value={formatNaira(totals.refunded)} hint={`${totals.refundedJobs} ${totals.refundedJobs === 1 ? "job" : "jobs"}`} />
        <Kpi label="Commission" value={formatNaira(totals.commission)} hint="Earned on released jobs" />
      </div>

      <FilterTabs
        active={status ?? "ALL"}
        items={[
          { value: "ALL", label: "All", count: all, href: withParams("/admin/escrow", { q }) },
          ...(["FUNDED", "AWAITING_RELEASE", "DISPUTED", "RELEASED", "REFUNDED"] as const).map((s) => ({
            value: s,
            label: STATUS_LABEL[s],
            count: counts[s] ?? 0,
            href: withParams("/admin/escrow", { q, status: s }),
          })),
        ]}
        className="mb-4"
      />

      <Form action="/admin/escrow" className="mb-6 flex gap-2 sm:max-w-md">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <Input name="q" defaultValue={q} placeholder="Search by ref, e.g. ESC-4821" aria-label="Search by reference" className="h-11" />
        <Button type="submit" variant="primary" className="h-11">
          Search
        </Button>
        {q ? (
          <Link href={withParams("/admin/escrow", { status })} className={buttonVariants({ variant: "ghost", className: "h-11" })}>
            Clear
          </Link>
        ) : null}
      </Form>

      {rows.length === 0 ? (
        <EmptyState
          title={q || status ? "No jobs match" : "No escrow jobs yet"}
          body={q || status ? "Try another reference or status." : "Jobs appear here as soon as a client funds a booking."}
        />
      ) : (
        <Table head={["Ref", "Client", "Artisan", "Service", "Amount", "Commission", "Payout", "Status", "Dates"]}>
          {rows.map((j) => (
            <Tr key={j.id}>
              <Td className="pb-2 md:pb-3.5">
                <span className="flex items-center justify-between gap-3 md:block">
                  <span className="font-mono text-xs whitespace-nowrap">{j.ref}</span>
                  <StatusBadge status={j.status} className="md:hidden" />
                </span>
              </Td>
              <Td label="Client">
                <span className="whitespace-nowrap">{j.client.name}</span>
              </Td>
              <Td label="Artisan">
                <Link href={`/admin/approvals/${j.provider.id}`} className="whitespace-nowrap hover:underline">
                  {j.provider.businessName}
                </Link>
              </Td>
              <Td label="Service">
                <span className="md:line-clamp-2 md:max-w-48">{j.serviceName}</span>
              </Td>
              <Td label="Amount">
                <span className="font-medium whitespace-nowrap tabular-nums">{formatNaira(j.amount)}</span>
              </Td>
              <Td label={`Commission ${j.commissionPct}%`}>
                <span className="whitespace-nowrap text-muted tabular-nums">{formatNaira(j.commissionAmount)}</span>
              </Td>
              <Td label="Payout">
                <span className="whitespace-nowrap tabular-nums">{formatNaira(j.payoutAmount)}</span>
              </Td>
              <Td label="Status" className="max-md:hidden">
                <StatusBadge status={j.status} />
              </Td>
              <Td label="Dates">
                <span className="text-xs whitespace-nowrap text-muted">
                  {formatDate(j.createdAt, short)}
                  {j.releasedAt ? ` → ${formatDate(j.releasedAt, short)}${j.autoReleased ? " (auto)" : ""}` : ""}
                  {!j.releasedAt && j.markedCompleteAt ? ` · done ${formatDate(j.markedCompleteAt, short)}` : ""}
                </span>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <Pager page={page} total={total} pageSize={PAGE_SIZE} hrefFor={(n) => withParams("/admin/escrow", { q, status, page: n })} />
    </>
  );
}
