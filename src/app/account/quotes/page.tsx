import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDate, formatNaira } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import { QuoteActions } from "@/components/client/account-actions";

export const metadata = { title: "Quotes" };

export default async function QuotesPage() {
  const user = await requireRole("CLIENT", "/account/quotes");

  const quotes = await db.quoteRequest.findMany({
    where: { clientId: user.id },
    orderBy: [{ updatedAt: "desc" }],
    include: {
      provider: { select: { businessName: true, slug: true } },
      job: { select: { ref: true } },
    },
  });
  // Quotes waiting on the client first.
  quotes.sort(
    (a, b) => Number(b.status === "QUOTED") - Number(a.status === "QUOTED"),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Quotes"
        title="Your requests"
        description="Artisans reply with a price and timeline. Accept to pay into escrow; nothing reaches them until you confirm the work."
      />

      {quotes.length === 0 ? (
        <EmptyState
          title="No quote requests yet"
          body="Open an artisan's profile and tap Request a quote. Their reply shows up here."
          action={
            <Link
              href="/artisans"
              className={buttonVariants({ variant: "accent" })}
            >
              Find an artisan
            </Link>
          }
        />
      ) : (
        <ul className="border-t border-border-strong">
          {quotes.map((q) => (
            <li key={q.id} className="border-b border-border py-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-medium">{q.title}</h2>
                    {q.status === "QUOTED" ? (
                      <Badge tone="accent">Quote ready</Badge>
                    ) : (
                      <StatusBadge status={q.status} />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    <Link
                      href={`/artisans/${q.provider.slug}`}
                      className="text-fg hover:underline"
                    >
                      {q.provider.businessName}
                    </Link>{" "}
                    · {q.area} · sent {formatDate(q.createdAt)}
                    {q.preferredDate
                      ? ` · for ${formatDate(q.preferredDate, { day: "numeric", month: "short" })}`
                      : ""}
                  </p>
                </div>
                {q.quoteAmount ? (
                  <p className="text-xl font-medium sm:text-right">
                    {formatNaira(q.quoteAmount)}
                  </p>
                ) : null}
              </div>

              {q.status === "QUOTED" ? (
                <div className="mt-4 rounded-2xl bg-surface-2 p-4">
                  <p className="text-sm">
                    <span className="font-medium">
                      {formatNaira(q.quoteAmount ?? 0)}
                    </span>
                    {q.quoteDuration ? (
                      <span className="text-muted">
                        {" "}
                        · takes {q.quoteDuration}
                      </span>
                    ) : null}
                  </p>
                  {q.quoteNotes ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                      {q.quoteNotes}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {q.status === "PENDING" ? (
                <p className="mt-3 text-sm text-muted">
                  Waiting for {q.provider.businessName} to price it.
                </p>
              ) : null}
              {q.status === "ACCEPTED" ? (
                <p className="mt-3 text-sm text-muted">
                  Accepted and paid into escrow{q.job ? ` as ${q.job.ref}` : ""}
                  .{" "}
                  <Link
                    href="/account/jobs"
                    className="text-fg underline underline-offset-4"
                  >
                    View job
                  </Link>
                </p>
              ) : null}

              {q.status === "PENDING" || q.status === "QUOTED" ? (
                <div className="mt-4">
                  <QuoteActions
                    quoteId={q.id}
                    status={q.status}
                    amount={q.quoteAmount}
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
