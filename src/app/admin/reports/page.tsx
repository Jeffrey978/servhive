import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { listReports, pageOf, pick, PAGE_SIZE, type ReportTab } from "@/server/admin";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { FilterTabs, Pager, Table, Td, Tr, withParams } from "@/components/admin/table";
import { formatNaira, timeAgo } from "@/lib/utils";

export const metadata = { title: "Reports" };

const TABS = ["ACTIVE", "OPEN", "ARTISAN_RESPONDED", "RESOLVED", "DISMISSED", "ALL"] as const satisfies readonly ReportTab[];
const TAB_LABEL: Record<(typeof TABS)[number], string> = {
  ACTIVE: "Needs action",
  OPEN: "Open",
  ARTISAN_RESPONDED: "Artisan responded",
  RESOLVED: "Resolved",
  DISMISSED: "Dismissed",
  ALL: "All",
};

export default async function ReportsPage({ searchParams }: PageProps<"/admin/reports">) {
  await requireRole("ADMIN", "/admin/reports");
  const sp = await searchParams;
  const tab = pick(sp.status, TABS) ?? "ACTIVE";
  const page = pageOf(sp.page);
  const { rows, total, counts } = await listReports(tab, page);
  const all = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);
  const countFor = (t: (typeof TABS)[number]) =>
    t === "ALL" ? all : t === "ACTIVE" ? (counts.OPEN ?? 0) + (counts.ARTISAN_RESPONDED ?? 0) : (counts[t] ?? 0);

  return (
    <>
      <PageHeader
        eyebrow="Trust & safety"
        title="Reports"
        description="Complaints from clients. A report on a disputed job keeps the escrow frozen until you release or refund."
      />

      <FilterTabs
        active={tab}
        items={TABS.map((t) => ({
          value: t,
          label: TAB_LABEL[t],
          href: withParams("/admin/reports", { status: t === "ACTIVE" ? undefined : t }),
          count: countFor(t),
        }))}
      />

      {rows.length === 0 ? (
        <EmptyState
          title={tab === "ACTIVE" ? "Nothing needs action" : "No reports here"}
          body={tab === "ACTIVE" ? "Every complaint has been resolved or dismissed." : "Try another filter."}
        />
      ) : (
        <Table head={["Artisan", "Reason", "Reporter", "Job", "Status", "Filed", ""]}>
          {rows.map((r) => (
            <Tr key={r.id}>
              <Td className="pb-2 md:pb-3.5">
                <Link href={`/admin/reports/${r.id}`} className="font-medium hover:underline">
                  {r.provider.businessName}
                </Link>
              </Td>
              <Td label="Reason">
                <span className="md:line-clamp-2 md:max-w-56">{r.reason}</span>
              </Td>
              <Td label="Reporter">{r.reporter.name}</Td>
              <Td label="Job">
                {r.job ? (
                  <span className="whitespace-nowrap">
                    <span className="font-mono text-xs">{r.job.ref}</span>
                    <span className="ml-2 text-xs text-muted">{formatNaira(r.job.amount)}</span>
                    {r.job.status === "DISPUTED" ? <span className="ml-2 text-xs font-medium text-danger">Frozen</span> : null}
                  </span>
                ) : (
                  <span className="text-xs text-muted">None</span>
                )}
              </Td>
              <Td label="Status">
                <StatusBadge status={r.status} />
              </Td>
              <Td label="Filed">
                <span className="whitespace-nowrap text-xs text-muted">{timeAgo(r.createdAt)}</span>
              </Td>
              <Td align="right" className="pt-3 md:pt-3.5">
                <Link href={`/admin/reports/${r.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                  Open
                </Link>
              </Td>
            </Tr>
          ))}
        </Table>
      )}

      <Pager
        page={page}
        total={total}
        pageSize={PAGE_SIZE}
        hrefFor={(n) => withParams("/admin/reports", { status: tab === "ACTIVE" ? undefined : tab, page: n })}
      />
    </>
  );
}
