import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { autoReleaseDueJobs, hoursUntilAutoRelease } from "@/server/escrow";
import { formatDate, formatNaira } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState, PageHeader } from "@/components/ui/misc";
import {
  EscrowJobActions,
  ReviewForm,
} from "@/components/client/account-actions";

export const metadata = { title: "Jobs & escrow" };

export default async function JobsPage() {
  const user = await requireRole("CLIENT", "/account/jobs");
  await autoReleaseDueJobs();

  const jobs = await db.escrowJob.findMany({
    where: { clientId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      provider: { select: { businessName: true, slug: true } },
      review: { select: { id: true, rating: true } },
    },
  });

  const held = jobs
    .filter((j) =>
      ["FUNDED", "AWAITING_RELEASE", "DISPUTED"].includes(j.status),
    )
    .reduce((s, j) => s + j.amount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Escrow"
        title="Jobs & escrow"
        description={`Your money is held until you confirm the work. If you don't respond, it releases ${RULES.autoReleaseHours} hours after the artisan marks the job done.`}
        actions={
          <p className="text-right">
            <span className="eyebrow block">Held now</span>
            <span className="text-h3 font-medium">{formatNaira(held)}</span>
          </p>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          body="Book a fixed-price service or accept a quote, and the job shows up here with its escrow status."
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
          {jobs.map((j) => {
            const hours = hoursUntilAutoRelease(j);
            const open =
              j.status === "FUNDED" || j.status === "AWAITING_RELEASE";
            return (
              <li key={j.id} className="border-b border-border py-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-medium">{j.serviceName}</h2>
                      <StatusBadge status={j.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      <Link
                        href={`/artisans/${j.provider.slug}`}
                        className="text-fg hover:underline"
                      >
                        {j.provider.businessName}
                      </Link>{" "}
                      · <span className="font-mono text-xs">{j.ref}</span> ·{" "}
                      {formatDate(j.createdAt)}
                    </p>
                  </div>
                  <p className="text-xl font-medium sm:text-right">
                    {formatNaira(j.amount)}
                  </p>
                </div>

                <p className="mt-3 text-sm text-muted">
                  {j.status === "FUNDED" &&
                    "Paid into escrow. Release once the work is done to your satisfaction."}
                  {j.status === "AWAITING_RELEASE" && (
                    <>
                      <span className="font-medium text-fg">
                        {j.provider.businessName} marked this done.
                      </span>{" "}
                      Auto-releases in {hours}h unless you release or dispute.
                    </>
                  )}
                  {j.status === "DISPUTED" &&
                    `Payment frozen while our team reviews. Decision within ${RULES.disputeDecisionDays} days.`}
                  {j.status === "RELEASED" &&
                    `Paid to ${j.provider.businessName}${j.releasedAt ? ` on ${formatDate(j.releasedAt)}` : ""}${j.autoReleased ? " (auto-released)" : ""}.`}
                  {j.status === "REFUNDED" && "Refunded to you after review."}
                </p>

                {open ? (
                  <div className="mt-4">
                    <EscrowJobActions
                      jobId={j.id}
                      amount={j.amount}
                      providerName={j.provider.businessName}
                    />
                  </div>
                ) : null}
                {j.status === "RELEASED" ? (
                  <div className="mt-4">
                    {j.review ? (
                      <p className="text-sm text-muted">
                        You rated this {j.review.rating}/5. Thank you.
                      </p>
                    ) : (
                      <ReviewForm
                        jobId={j.id}
                        providerName={j.provider.businessName}
                      />
                    )}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
