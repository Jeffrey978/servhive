import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { loadPro } from "@/server/pro";
import { respondToReportAction } from "@/server/pro-actions";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { NoProvider } from "@/components/pro/no-provider";
import { RespondForm } from "@/components/pro/respond-form";

export default async function ProComplaintsPage() {
  const { provider } = await loadPro("/pro/complaints");
  if (!provider) return <NoProvider />;

  const reports = await db.report.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    include: { job: { select: { ref: true, serviceName: true } } },
    take: 100,
  });

  return (
    <>
      <PageHeader
        eyebrow="Complaints"
        title="Complaints & disputes"
        description="When a client raises an issue, give your side. The Servhive team reads both before deciding."
      />

      {reports.length === 0 ? (
        <EmptyState title="No complaints" body="Keep it that way: agree prices in writing and keep payments on Servhive." />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {reports.map((r) => {
            const canRespond = !r.artisanResponse && (r.status === "OPEN" || r.status === "ARTISAN_RESPONDED");
            return (
              <li key={r.id} className="py-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-lg font-medium">{r.reason}</p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(r.createdAt)}
                      {r.job ? (
                        <>
                          {" "}
                          · <span className="font-mono text-xs">{r.job.ref}</span> {r.job.serviceName}
                        </>
                      ) : null}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
                {r.notes ? <p className="mt-3 max-w-2xl whitespace-pre-wrap text-[0.9375rem] leading-relaxed">{r.notes}</p> : null}

                {r.artisanResponse ? (
                  <div className="mt-4 max-w-2xl border-l-2 border-border-strong pl-4">
                    <p className="eyebrow">Your response</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-relaxed">{r.artisanResponse}</p>
                  </div>
                ) : null}
                {r.resolutionNote ? (
                  <div className="mt-4 max-w-2xl border-l-2 border-accent pl-4">
                    <p className="eyebrow">Servhive decision</p>
                    <p className="mt-1.5 whitespace-pre-wrap text-[0.9375rem] leading-relaxed">{r.resolutionNote}</p>
                  </div>
                ) : null}
                {canRespond ? (
                  <div className="mt-5 max-w-2xl">
                    <RespondForm reportId={r.id} action={respondToReportAction} />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
