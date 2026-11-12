import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import { getReport } from "@/server/admin";
import { closeReport, settleDispute, suspendProvider } from "@/server/admin-actions";
import { StatusBadge } from "@/components/ui/badge";
import { Card, PageHeader } from "@/components/ui/misc";
import { BackLink } from "@/components/admin/table";
import { ConfirmAction } from "@/components/admin/confirm-action";
import { cn, formatDate, formatNaira } from "@/lib/utils";

export const metadata = { title: "Report" };

const dateTime: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };

export default async function ReportPage({ params }: PageProps<"/admin/reports/[id]">) {
  const { id } = await params;
  await requireRole("ADMIN", `/admin/reports/${id}`);
  const r = await getReport(id);
  if (!r) notFound();

  const open = r.status === "OPEN" || r.status === "ARTISAN_RESPONDED";
  const job = r.job;
  const frozen = job?.status === "DISPUTED";
  const canSuspend = r.provider.status === "APPROVED" || r.provider.status === "UNDER_REVIEW";

  return (
    <>
      <BackLink href="/admin/reports">Reports</BackLink>
      <PageHeader
        eyebrow={`Report · filed ${formatDate(r.createdAt)}`}
        title={r.reason}
        description={`Against ${r.provider.businessName}, reported by ${r.reporter.name}.`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={r.status} />
            {frozen ? <StatusBadge status="DISPUTED" /> : null}
          </div>
        }
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-10">
          <section>
            <Heading n="01" title="Client's account" />
            <p className="max-w-prose whitespace-pre-line">{r.notes || <span className="text-muted">No notes given.</span>}</p>
          </section>

          <section>
            <Heading n="02" title="Artisan's response" />
            {r.artisanResponse ? (
              <p className="max-w-prose whitespace-pre-line">{r.artisanResponse}</p>
            ) : (
              <p className="text-sm text-muted">The artisan hasn&apos;t responded yet.</p>
            )}
          </section>

          {job ? (
            <section>
              <Heading n="03" title="Linked job" meta={<span className="font-mono">{job.ref}</span>} />
              <div className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-3">
                <Cell label="Service">{job.serviceName}</Cell>
                <Cell label="Amount">{formatNaira(job.amount)}</Cell>
                <Cell label="Status">
                  <StatusBadge status={job.status} />
                </Cell>
                <Cell label="Commission">
                  {formatNaira(job.commissionAmount)} <span className="text-xs text-muted">({job.commissionPct}%)</span>
                </Cell>
                <Cell label="Artisan payout">{formatNaira(job.payoutAmount)}</Cell>
                <Cell label="Area">{job.area}</Cell>
              </div>
              <ol className="mt-6 border-l border-border pl-5">
                <Step on label="Funded into escrow" at={job.createdAt} />
                <Step on={!!job.markedCompleteAt} label="Marked complete by artisan" at={job.markedCompleteAt} />
                {job.status === "DISPUTED" ? <Step on danger label="Disputed — escrow frozen" at={r.createdAt} /> : null}
                {job.status === "REFUNDED" ? (
                  <Step on label="Refunded to client" at={job.updatedAt} />
                ) : (
                  <Step
                    on={!!job.releasedAt}
                    label={job.autoReleased ? "Auto-released to artisan" : "Released to artisan"}
                    at={job.releasedAt}
                  />
                )}
              </ol>
            </section>
          ) : null}

          {!open && r.resolutionNote ? (
            <section>
              <Heading n={job ? "04" : "03"} title="Resolution" />
              <p className="max-w-prose whitespace-pre-line">{r.resolutionNote}</p>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <Card className="p-5">
            <p className="eyebrow mb-4">Decision</p>
            {!open ? (
              <p className="text-sm text-muted">This report is {r.status === "RESOLVED" ? "resolved" : "dismissed"}.</p>
            ) : frozen && job ? (
              <div className="space-y-4">
                <p className="text-sm text-muted">
                  {formatNaira(job.amount)} is frozen. Decide where it goes; the report closes with your decision. Test mode: no real
                  money moves.
                </p>
                <div className="flex flex-col items-start gap-2">
                  <ConfirmAction
                    action={settleDispute}
                    fields={{ reportId: r.id, decision: "RELEASE" }}
                    label="Release to artisan"
                    confirmLabel={`Release ${formatNaira(job.payoutAmount)}`}
                    variant="primary"
                    prompt={`${formatNaira(job.payoutAmount)} goes to ${r.provider.businessName} after the ${job.commissionPct}% commission. This can't be undone.`}
                    note={{ name: "note", label: "Decision note", placeholder: "Photos show the work was done as quoted.", required: true }}
                  />
                  <ConfirmAction
                    action={settleDispute}
                    fields={{ reportId: r.id, decision: "REFUND" }}
                    label="Refund client"
                    confirmLabel={`Refund ${formatNaira(job.amount)}`}
                    confirmVariant="danger"
                    prompt={`The full ${formatNaira(job.amount)} goes back to ${r.reporter.name}. This can't be undone.`}
                    note={{ name: "note", label: "Decision note", placeholder: "Artisan didn't show up for the booked date.", required: true }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2">
                <ConfirmAction
                  action={closeReport}
                  fields={{ reportId: r.id, outcome: "RESOLVED" }}
                  label="Resolve"
                  confirmLabel="Mark resolved"
                  variant="primary"
                  note={{ name: "note", label: "Resolution note", placeholder: "Spoke to both sides; artisan agreed to redo the tiling.", required: true }}
                />
                <ConfirmAction
                  action={closeReport}
                  fields={{ reportId: r.id, outcome: "DISMISSED" }}
                  label="Dismiss"
                  confirmLabel="Dismiss report"
                  note={{ name: "note", label: "Why it's dismissed", placeholder: "No evidence of a bypass request in the chat.", required: true }}
                />
              </div>
            )}
          </Card>

          <Card className="divide-y divide-border">
            <Party title="Artisan">
              <Link href={`/admin/approvals/${r.provider.id}`} className="font-medium hover:underline">
                {r.provider.businessName}
              </Link>
              <span className="block text-xs text-muted">
                {r.provider.ownerName} · {r.provider.category.name} · {r.provider.area}
              </span>
              {r.provider.phone ? <Contact href={`tel:${r.provider.phone}`}>{r.provider.phone}</Contact> : null}
              <span className="mt-2 flex items-center gap-2">
                <StatusBadge status={r.provider.status} />
                <span className="text-xs text-muted">
                  {r.provider._count.reports} {r.provider._count.reports === 1 ? "report" : "reports"} total
                </span>
              </span>
              {canSuspend ? (
                <div className="mt-3">
                  <ConfirmAction
                    action={suspendProvider}
                    fields={{ providerId: r.provider.id }}
                    label="Suspend artisan"
                    confirmLabel="Suspend artisan"
                    confirmVariant="danger"
                    variant="ghost"
                    prompt="Hides the profile from the marketplace. The report stays open."
                    note={{ name: "note", label: "Note (optional, shown to the artisan)" }}
                  />
                </div>
              ) : null}
            </Party>
            <Party title="Reporter">
              <span className="font-medium">{r.reporter.name}</span>
              {r.reporter.email ? <Contact href={`mailto:${r.reporter.email}`}>{r.reporter.email}</Contact> : null}
              {r.reporter.phone ? <Contact href={`tel:${r.reporter.phone}`}>{r.reporter.phone}</Contact> : null}
            </Party>
          </Card>
        </aside>
      </div>
    </>
  );
}

function Heading({ n, title, meta }: { n: string; title: string; meta?: ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-3">
      <span className="font-mono text-xs text-muted">{n}</span>
      <h2 className="text-h3 font-medium">{title}</h2>
      {meta ? <span className="ml-auto text-sm text-muted">{meta}</span> : null}
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-surface px-4 py-3">
      <p className="eyebrow mb-1">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function Step({ on, danger, label, at }: { on: boolean; danger?: boolean; label: string; at: Date | null }) {
  return (
    <li className="relative pb-5 last:pb-0">
      <span
        className={cn(
          "absolute top-1.5 -left-[calc(1.5rem+0.5px)] size-2 rounded-full border",
          danger ? "border-danger bg-danger" : on ? "border-fg bg-fg" : "border-border-strong bg-bg",
        )}
        aria-hidden
      />
      <p className={cn("text-sm", on ? "text-fg" : "text-muted")}>{label}</p>
      <p className="text-xs text-muted">{at ? formatDate(at, dateTime) : "Not yet"}</p>
    </li>
  );
}

function Party({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="px-5 py-4 text-sm">
      <p className="eyebrow mb-2">{title}</p>
      {children}
    </div>
  );
}

function Contact({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="block break-all text-xs text-muted hover:text-fg hover:underline">
      {children}
    </a>
  );
}
