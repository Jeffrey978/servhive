import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { autoReleaseDueJobs } from "@/server/escrow";
import { overviewData } from "@/server/admin";
import { PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { Kpi } from "@/components/admin/table";
import { formatNaira, timeAgo } from "@/lib/utils";

export const metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  await requireRole("ADMIN", "/admin");
  await autoReleaseDueJobs();
  const d = await overviewData();

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title={
          <>
            Today on <em className="font-serif font-normal">Servhive</em>
          </>
        }
        description="Verification queue, complaints and money held in escrow across Port Harcourt."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Kpi label="Pending approvals" value={d.pending} hint="Waiting for review" href="/admin/approvals" highlight={d.pending > 0} />
        <Kpi label="Open reports" value={d.openReports} hint="Need a decision" href="/admin/reports" />
        <Kpi label="Artisans live" value={d.live} hint="Verified and listed" href="/admin/artisans?status=APPROVED" />
        <Kpi label="Held in escrow" value={formatNaira(d.heldAmount)} hint={`${d.heldJobs} active ${d.heldJobs === 1 ? "job" : "jobs"}`} href="/admin/escrow" />
        <Kpi label="Commission earned" value={formatNaira(d.commission)} hint="5% of released jobs" />
        <Kpi label="Jobs this month" value={d.jobsThisMonth} hint="Funded into escrow" />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <QueueHeader title="Newest submissions" href="/admin/approvals" />
          {d.pendingQueue.length === 0 ? (
            <p className="border-t border-border py-6 text-sm text-muted">Queue is clear. Nothing waiting for review.</p>
          ) : (
            <ol className="border-t border-border">
              {d.pendingQueue.map((p, i) => (
                <li key={p.id} className="border-b border-border">
                  <Link href={`/admin/approvals/${p.id}`} className="group flex items-baseline gap-4 py-4">
                    <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium group-hover:underline">{p.businessName}</span>
                      <span className="block truncate text-sm text-muted">
                        {p.category.name} · {p.area}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{timeAgo(p.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section>
          <QueueHeader title="Latest reports" href="/admin/reports" />
          {d.latestReports.length === 0 ? (
            <p className="border-t border-border py-6 text-sm text-muted">No reports filed yet.</p>
          ) : (
            <ol className="border-t border-border">
              {d.latestReports.map((r, i) => (
                <li key={r.id} className="border-b border-border">
                  <Link href={`/admin/reports/${r.id}`} className="group flex items-baseline gap-4 py-4">
                    <span className="font-mono text-xs text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium group-hover:underline">{r.provider.businessName}</span>
                      <span className="block truncate text-sm text-muted">{r.reason}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <StatusBadge status={r.job?.status === "DISPUTED" && r.status !== "RESOLVED" ? "DISPUTED" : r.status} />
                      <span className="text-xs text-muted">{timeAgo(r.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}

function QueueHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-h3 font-medium">{title}</h2>
      <Link href={href} className="text-sm text-muted hover:text-fg">
        View all
      </Link>
    </div>
  );
}
