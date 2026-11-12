import { CalendarDays, Lock, MapPin } from "lucide-react";
import { db } from "@/lib/db";
import { formatDate, formatNaira, timeAgo } from "@/lib/utils";
import { loadPro } from "@/server/pro";
import { declineQuoteAction, sendQuoteAction } from "@/server/pro-actions";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { NoProvider } from "@/components/pro/no-provider";
import { QuoteForm } from "@/components/pro/quote-form";

export default async function ProRequestsPage() {
  const { provider } = await loadPro("/pro/requests");
  if (!provider) return <NoProvider />;

  const rows = await db.quoteRequest.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    include: { client: { select: { name: true } } },
    take: 200,
  });
  const open = rows.filter((r) => r.status === "PENDING" || r.status === "QUOTED");
  const closed = rows.filter((r) => r.status !== "PENDING" && r.status !== "QUOTED");

  return (
    <>
      <PageHeader
        eyebrow="Requests"
        title="Quote requests"
        description="Price the job, and the client funds escrow when they accept. You see the area up front; their full name and address unlock after acceptance."
      />

      <h2 className="eyebrow mb-3">Open · {open.length}</h2>
      {open.length === 0 ? (
        <EmptyState title="You're all caught up" body="New quote requests from clients will appear here." />
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {open.map((q) => (
            <li key={q.id} className="py-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-medium">{q.title}</p>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                    <span>
                      <span className="text-fg">{q.client.name.trim().split(/\s+/)[0]}</span> · {timeAgo(q.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {q.area}
                    </span>
                    {q.preferredDate ? (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" /> {formatDate(q.preferredDate, { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      <Lock className="size-3.5" /> Full name & address after acceptance
                    </span>
                  </p>
                </div>
                {q.status === "QUOTED" && q.quoteAmount ? (
                  <p className="shrink-0 text-sm text-muted">
                    Quoted <span className="font-medium text-fg tabular-nums">{formatNaira(q.quoteAmount)}</span>
                    {q.quoteDuration ? ` · ${q.quoteDuration}` : null}
                  </p>
                ) : null}
              </div>
              <p className="mt-3 max-w-2xl whitespace-pre-wrap text-[0.9375rem] leading-relaxed">{q.details}</p>
              <div className="mt-4">
                <QuoteForm
                  quoteId={q.id}
                  sendAction={sendQuoteAction}
                  declineAction={declineQuoteAction}
                  initial={{ amount: q.quoteAmount, duration: q.quoteDuration, notes: q.quoteNotes }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="eyebrow mb-3 mt-14">Closed · {closed.length}</h2>
      {closed.length === 0 ? (
        <p className="text-sm text-muted">Accepted, declined and cancelled requests are kept here.</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {closed.map((q) => {
            const accepted = q.status === "ACCEPTED";
            return (
              <li key={q.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium">{q.title}</p>
                  {accepted ? (
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                      <span className="text-fg">{q.client.name}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5" /> {q.address}, {q.area}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted">{formatDate(q.updatedAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {q.quoteAmount ? <span className="text-sm tabular-nums">{formatNaira(q.quoteAmount)}</span> : null}
                  <StatusBadge status={q.status} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
