import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, PageHeader } from "@/components/ui/misc";

export const metadata = { title: "Reports" };

export default async function ReportsPage() {
  const user = await requireRole("CLIENT", "/account/reports");

  const reports = await db.report.findMany({
    where: { reporterId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { businessName: true, slug: true } },
      job: { select: { ref: true } },
    },
  });

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Reports & disputes"
        description="Every report is reviewed by our team. The artisan can respond, and we decide within 5 days."
      />
      {reports.length === 0 ? (
        <EmptyState
          title="No reports"
          body="If something goes wrong with an artisan or a job, report it from their profile or the Jobs page."
        />
      ) : (
        <ul className="border-t border-border-strong">
          {reports.map((r) => (
            <li key={r.id} className="border-b border-border py-6">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-medium">{r.reason}</h2>
                <StatusBadge status={r.status} />
              </div>
              <p className="mt-1 text-sm text-muted">
                <Link
                  href={`/artisans/${r.provider.slug}`}
                  className="text-fg hover:underline"
                >
                  {r.provider.businessName}
                </Link>
                {r.job ? (
                  <>
                    {" "}
                    · <span className="font-mono text-xs">{r.job.ref}</span>
                  </>
                ) : null}{" "}
                · {formatDate(r.createdAt)}
              </p>
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed">
                {r.notes}
              </p>

              {r.artisanResponse || r.resolutionNote ? (
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {r.artisanResponse ? (
                    <div className="rounded-2xl bg-surface-2 p-4">
                      <dt className="eyebrow mb-2">Artisan&apos;s response</dt>
                      <dd className="whitespace-pre-wrap text-sm leading-relaxed">
                        {r.artisanResponse}
                      </dd>
                    </div>
                  ) : null}
                  {r.resolutionNote ? (
                    <div className="rounded-2xl border border-border p-4">
                      <dt className="eyebrow mb-2">Servhive decision</dt>
                      <dd className="whitespace-pre-wrap text-sm leading-relaxed">
                        {r.resolutionNote}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
