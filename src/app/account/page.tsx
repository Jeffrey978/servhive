import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { autoReleaseDueJobs, hoursUntilAutoRelease } from "@/server/escrow";
import { formatNaira } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Stat } from "@/components/ui/misc";

export const metadata = { title: "Overview" };

function greeting() {
  const h = Number(
    new Date().toLocaleString("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Lagos",
    }),
  );
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function AccountOverview() {
  const user = await requireRole("CLIENT", "/account");
  await autoReleaseDueJobs();

  const [held, activeJobs, quotesReady, savedCount, awaiting] =
    await Promise.all([
      db.escrowJob.aggregate({
        where: {
          clientId: user.id,
          status: { in: ["FUNDED", "AWAITING_RELEASE", "DISPUTED"] },
        },
        _sum: { amount: true },
      }),
      db.escrowJob.count({
        where: {
          clientId: user.id,
          status: { in: ["FUNDED", "AWAITING_RELEASE", "DISPUTED"] },
        },
      }),
      db.quoteRequest.findMany({
        where: { clientId: user.id, status: "QUOTED" },
        orderBy: { updatedAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          quoteAmount: true,
          provider: { select: { businessName: true } },
        },
      }),
      db.savedProvider.count({ where: { userId: user.id } }),
      db.escrowJob.findMany({
        where: { clientId: user.id, status: "AWAITING_RELEASE" },
        orderBy: { markedCompleteAt: "asc" },
        take: 5,
        select: {
          id: true,
          serviceName: true,
          amount: true,
          status: true,
          markedCompleteAt: true,
          provider: { select: { businessName: true } },
        },
      }),
    ]);

  const actions = [
    ...awaiting.map((j) => {
      const h = hoursUntilAutoRelease(j);
      return {
        key: `j-${j.id}`,
        href: "/account/jobs",
        title: `Confirm ${j.serviceName}`,
        meta: `${j.provider.businessName} marked it done · auto-releases in ${h ?? 0}h`,
        value: formatNaira(j.amount),
      };
    }),
    ...quotesReady.map((q) => ({
      key: `q-${q.id}`,
      href: "/account/quotes",
      title: `Quote ready: ${q.title}`,
      meta: `${q.provider.businessName} · accept to fund escrow`,
      value: q.quoteAmount ? formatNaira(q.quoteAmount) : "",
    })),
  ];

  const firstName = user.name.split(/\s+/)[0];

  return (
    <div>
      <div className="mb-10">
        <p className="eyebrow mb-3">My account</p>
        <h1 className="text-h2 font-medium">
          {greeting()}, <em className="font-serif font-normal">{firstName}.</em>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="In escrow" value={formatNaira(held._sum.amount ?? 0)} />
        <Stat label="Active jobs" value={activeJobs} />
        <Stat label="Quotes for you" value={quotesReady.length} />
        <Stat label="Saved" value={savedCount} />
      </div>

      <section className="mt-14" aria-labelledby="next">
        <div className="flex items-baseline justify-between border-b border-border-strong pb-4">
          <h2 id="next" className="text-h3 font-medium">
            Next up
          </h2>
          <span className="eyebrow">{actions.length} to do</span>
        </div>
        {actions.length === 0 ? (
          <p className="py-8 text-muted">
            Nothing needs you right now. Quotes and jobs that need a decision
            show up here.
          </p>
        ) : (
          <ol>
            {actions.map((a, i) => (
              <li key={a.key}>
                <Link
                  href={a.href}
                  className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 border-b border-border py-5 transition-colors hover:bg-surface-2/60 sm:grid-cols-[2.5rem_1fr_auto_auto] sm:gap-x-6 sm:px-2"
                >
                  <span className="eyebrow">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-muted">
                      {a.meta}
                    </span>
                  </span>
                  <span className="font-medium">{a.value}</span>
                  <ArrowUpRight className="hidden size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="mt-14 grid gap-6 rounded-card border border-border p-6 md:grid-cols-[1fr_auto] md:items-end md:p-10">
        <div>
          <p className="eyebrow mb-3">Need something done?</p>
          <p className="max-w-lg text-h3 font-medium">
            Verified artisans across Port Harcourt,{" "}
            <em className="font-serif font-normal">paid only</em> when
            you&apos;re happy.
          </p>
        </div>
        <Link
          href="/artisans"
          className={buttonVariants({ variant: "accent", size: "lg" })}
        >
          Browse artisans
        </Link>
      </section>
    </div>
  );
}
