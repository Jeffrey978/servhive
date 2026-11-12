import { CalendarDays, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { formatDate, formatNaira } from "@/lib/utils";
import { autoReleaseDueJobs, hoursUntilAutoRelease } from "@/server/escrow";
import { loadPro } from "@/server/pro";
import { markJobCompleteAction } from "@/server/pro-actions";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { ConfirmAction } from "@/components/pro/form-bits";
import { NoProvider } from "@/components/pro/no-provider";

export default async function ProJobsPage() {
  const { provider } = await loadPro("/pro/jobs");
  if (!provider) return <NoProvider />;
  await autoReleaseDueJobs();

  const jobs = await db.escrowJob.findMany({
    where: { providerId: provider.id },
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { name: true } } },
    take: 200,
  });
  const active = jobs.filter((j) => j.status === "FUNDED" || j.status === "AWAITING_RELEASE" || j.status === "DISPUTED");
  const done = jobs.filter((j) => j.status === "RELEASED" || j.status === "REFUNDED");

  return (
    <>
      <PageHeader
        eyebrow="Jobs"
        title="Escrow jobs"
        description={`The client's money is held by Servhive. Mark the work complete and it pays out after ${RULES.autoReleaseHours}h, or sooner if the client releases it.`}
      />

      <h2 className="eyebrow mb-3">Active · {active.length}</h2>
      {active.length === 0 ? (
        <EmptyState title="No active jobs" body="When a client accepts your quote or books a service, the funded job shows up here." />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {active.map((j) => {
            const hours = hoursUntilAutoRelease(j);
            return (
              <li key={j.id} className="grid gap-4 py-6 md:grid-cols-[1fr_auto]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-medium">{j.serviceName}</p>
                    <StatusBadge status={j.status} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted">{j.ref}</p>
                  <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="text-fg">{j.client.name}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" /> {j.address}, {j.area}
                    </span>
                    {j.scheduledFor ? (
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="size-3.5" /> {formatDate(j.scheduledFor, { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:items-end">
                  <Amounts amount={j.amount} payout={j.payoutAmount} />
                  {j.status === "FUNDED" ? (
                    <ConfirmAction
                      action={markJobCompleteAction}
                      fields={{ jobId: j.id }}
                      label="Mark work complete"
                      confirmLabel="Confirm complete"
                      pendingLabel="Saving…"
                      prompt="Only when the job is done."
                      variant="primary"
                    />
                  ) : j.status === "AWAITING_RELEASE" ? (
                    <p className="text-sm text-muted">
                      Auto-releases in <span className="font-medium text-fg">{hours}h</span>
                    </p>
                  ) : (
                    <p className="max-w-xs text-sm text-danger md:text-right">Payment frozen while Servhive reviews the dispute.</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="eyebrow mb-3 mt-14">Finished · {done.length}</h2>
      {done.length === 0 ? (
        <p className="text-sm text-muted">Paid out and refunded jobs are kept here.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {done.map((j) => (
            <li key={j.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <p className="truncate font-medium">{j.serviceName}</p>
                <p className="mt-1 text-sm text-muted">
                  <span className="font-mono text-xs">{j.ref}</span> · {formatDate(j.releasedAt ?? j.updatedAt)}
                  {j.autoReleased ? " · auto-released" : null}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Amounts amount={j.amount} payout={j.status === "REFUNDED" ? 0 : j.payoutAmount} />
                <StatusBadge status={j.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Amounts({ amount, payout }: { amount: number; payout: number }) {
  return (
    <p className="text-sm text-muted md:text-right">
      <span className="text-base font-medium text-fg tabular-nums">{formatNaira(payout)}</span>
      <span className="ml-1.5">of {formatNaira(amount)}</span>
    </p>
  );
}
