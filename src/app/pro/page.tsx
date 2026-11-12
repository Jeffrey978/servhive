import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { formatDate, formatNaira, timeAgo } from "@/lib/utils";
import { autoReleaseDueJobs } from "@/server/escrow";
import { boostState, loadPro, proStats, readiness, type ProProvider } from "@/server/pro";
import { buyBoostAction } from "@/server/pro-actions";
import { Card, EmptyState, PageHeader, Stat } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Checklist } from "@/components/pro/checklist";
import { ConfirmAction } from "@/components/pro/form-bits";
import { NoProvider } from "@/components/pro/no-provider";

export default async function ProOverviewPage() {
  const { user, provider } = await loadPro("/pro");
  if (!provider) return <NoProvider />;
  await autoReleaseDueJobs();

  const [stats, ready, requests, jobs] = await Promise.all([
    proStats(provider.id),
    readiness(provider),
    db.quoteRequest.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.escrowJob.findMany({ where: { providerId: provider.id }, orderBy: { updatedAt: "desc" }, take: 5 }),
  ]);
  const boost = boostState(provider);
  const firstName = user.name.split(/\s+/)[0];

  return (
    <>
      <PageHeader
        eyebrow={provider.category.name}
        title={
          <>
            Welcome back, <em className="font-serif font-normal">{firstName}</em>
          </>
        }
        actions={
          provider.status === "APPROVED" ? (
            <Link href={`/artisans/${provider.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              View public profile <ArrowUpRight />
            </Link>
          ) : null
        }
      />

      <StatusBanner provider={provider} items={ready.items} />

      <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Earned" value={formatNaira(stats.earned)} hint={`${stats.paidJobs} paid job${stats.paidJobs === 1 ? "" : "s"}`} />
        <Stat label="In escrow" value={formatNaira(stats.held)} hint={`${stats.heldJobs} active`} />
        <Stat label="Open requests" value={stats.openRequests} hint="Awaiting your quote" />
        <Stat
          label="Rating"
          value={provider.reviewCount > 0 ? provider.ratingAvg.toFixed(1) : "—"}
          hint={`${provider.reviewCount} review${provider.reviewCount === 1 ? "" : "s"}`}
        />
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <ListHeader title="Recent requests" href="/pro/requests" />
          {requests.length === 0 ? (
            <EmptyState className="py-10" title="No requests yet" body="Clients' quote requests will land here." />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {requests.map((q) => (
                <li key={q.id}>
                  <Link href="/pro/requests" className="flex items-center gap-3 py-3.5 hover:text-fg">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{q.title}</span>
                      <span className="block text-xs text-muted">{timeAgo(q.createdAt)}</span>
                    </span>
                    <StatusBadge status={q.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <ListHeader title="Recent jobs" href="/pro/jobs" />
          {jobs.length === 0 ? (
            <EmptyState className="py-10" title="No jobs yet" body="Accepted quotes and bookings appear here once funded." />
          ) : (
            <ul className="divide-y divide-border border-y border-border">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link href="/pro/jobs" className="flex items-center gap-3 py-3.5">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{j.serviceName}</span>
                      <span className="block font-mono text-xs text-muted">{j.ref}</span>
                    </span>
                    <span className="text-sm tabular-nums">{formatNaira(j.payoutAmount)}</span>
                    <StatusBadge status={j.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="mt-12 max-w-xl">
        <Card className="flex flex-col justify-between gap-6 p-6">
          <div>
            <p className="eyebrow">Boost</p>
            <p className="mt-3 text-h3 font-medium">
              {boost.active ? (
                <>
                  Boosted until <em className="font-serif font-normal">{formatDate(boost.until!)}</em>
                </>
              ) : (
                "Show up first in your areas"
              )}
            </p>
            <p className="mt-2 text-sm text-muted">
              {formatNaira(RULES.boostPricePerWeek)} per week · test mode
            </p>
          </div>
          <ConfirmAction
            action={buyBoostAction}
            label={boost.active ? "Add another week" : "Boost for 1 week"}
            confirmLabel={`Pay ${formatNaira(RULES.boostPricePerWeek)}`}
            pendingLabel="Processing…"
            prompt="Test payment, no card charged."
            variant="accent"
            confirmVariant="accent"
            disabled={provider.status !== "APPROVED"}
          />
          {provider.status !== "APPROVED" ? <p className="-mt-4 text-xs text-muted">Available once your profile is live.</p> : null}
        </Card>
      </section>
    </>
  );
}

function ListHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-medium">{title}</h2>
      <Link href={href} className="text-sm text-muted hover:text-fg">
        View all
      </Link>
    </div>
  );
}

function StatusBanner({ provider, items }: { provider: ProProvider; items: Parameters<typeof Checklist>[0]["items"] }) {
  if (provider.status === "APPROVED") return null;

  if (provider.status === "DRAFT") {
    return (
      <Card className="grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
        <div>
          <p className="eyebrow">Not live yet</p>
          <p className="mt-3 text-h3 font-medium">
            Finish verification to <em className="font-serif font-normal">go live</em>
          </p>
          <p className="mt-2 text-sm text-muted">Clients only see verified artisans.</p>
          <Link href="/pro/verification" className={buttonVariants({ variant: "primary", size: "sm", className: "mt-5" })}>
            Go to verification
          </Link>
        </div>
        <Checklist items={items} />
      </Card>
    );
  }

  // Provider.rejectionReason carries the rejection reason (REJECTED) or the suspension note (SUSPENDED).
  const copy = {
    UNDER_REVIEW: {
      eyebrow: "Under review",
      title: "We're checking your documents",
      noteLabel: null,
      body: "Usually 1–2 working days. You can keep editing your profile.",
    },
    REJECTED: {
      eyebrow: "Changes needed",
      title: "Your profile wasn't approved",
      noteLabel: "Reason",
      body: provider.rejectionReason ?? "Update your documents and resubmit.",
    },
    SUSPENDED: {
      eyebrow: "Suspended",
      title: "Your profile is hidden from clients",
      noteLabel: "Note from Servhive",
      body: provider.rejectionReason ?? "Contact support to resolve open issues on your account.",
    },
  }[provider.status];

  return (
    <Card className={provider.status === "UNDER_REVIEW" ? "border-info/40 p-6" : "border-danger/40 p-6"}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <p className="mt-2 text-lg font-medium">{copy.title}</p>
          {copy.noteLabel ? <p className="mt-3 text-xs font-medium text-muted">{copy.noteLabel}</p> : null}
          <p className={copy.noteLabel ? "mt-0.5 text-sm" : "mt-1 text-sm text-muted"}>{copy.body}</p>
        </div>
        {provider.status === "REJECTED" ? (
          <Link href="/pro/verification" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Fix and resubmit
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
