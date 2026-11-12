import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { RULES } from "@/lib/constants";
import type { Provider } from "@/generated/prisma/client";

/**
 * Read-side helpers for the artisan Pro portal (/pro). Mutations live in
 * `@/server/pro-actions`. Everything is scoped by the signed-in user's id.
 */

export const getProviderForUser = cache(async (userId: string) =>
  db.provider.findUnique({ where: { userId }, include: { category: true } }),
);

export type ProProvider = NonNullable<Awaited<ReturnType<typeof getProviderForUser>>>;

/** Page guard: ARTISAN only, plus their provider row (null in the rare no-row case). */
export async function loadPro(returnTo: string) {
  const user = await requireRole("ARTISAN", returnTo);
  const provider = await getProviderForUser(user.id);
  return { user, provider };
}

const DAY = 86_400_000;

export function daysUntil(d: Date | null | undefined) {
  if (!d) return 0;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / DAY));
}

export function isFuture(d: Date | null | undefined) {
  return !!d && d.getTime() > Date.now();
}

/** Trial / subscription state for the billing page and the sidebar card. */
export function billingState(p: Pick<Provider, "trialEndsAt" | "subscriptionPaidUntil">) {
  const trialActive = isFuture(p.trialEndsAt);
  const paidActive = isFuture(p.subscriptionPaidUntil);
  const coveredUntil = [p.trialEndsAt, p.subscriptionPaidUntil]
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
  const state: "trial" | "paid" | "due" = trialActive ? "trial" : paidActive ? "paid" : "due";
  return {
    state,
    trialActive,
    trialDaysLeft: daysUntil(p.trialEndsAt),
    paidActive,
    paidUntil: p.subscriptionPaidUntil,
    coveredUntil,
    coveredDaysLeft: daysUntil(coveredUntil),
  };
}

export function boostState(p: Pick<Provider, "boostedUntil">) {
  const active = isFuture(p.boostedUntil);
  return { active, until: active ? p.boostedUntil : null, daysLeft: daysUntil(p.boostedUntil) };
}

export function maskAccount(n: string) {
  return `••••${n.slice(-4)}`;
}

export type ChecklistItem = { key: string; label: string; done: boolean; required: boolean; href: string; meta?: string };

/** What's still needed before the artisan can submit for review (and go live). */
export async function readiness(provider: ProProvider) {
  const [docs, photoCount, payout] = await Promise.all([
    db.verificationDocument.findMany({
      where: { providerId: provider.id },
      // fileUrl holds the (large) data URL — never needed for status display.
      select: { kind: true, status: true, fileName: true, licenceNumber: true, rejectionReason: true, submittedAt: true },
    }),
    db.workPhoto.count({ where: { providerId: provider.id } }),
    db.payoutAccount.findUnique({ where: { providerId: provider.id }, select: { id: true } }),
  ]);
  const ok = (kind: "GOVERNMENT_ID" | "TRADE_LICENCE") => {
    const d = docs.find((x) => x.kind === kind);
    return !!d && (d.status === "SUBMITTED" || d.status === "APPROVED");
  };
  const needsLicence = provider.category.requiresLicence;
  const items: ChecklistItem[] = [
    { key: "id", label: "Government ID uploaded", done: ok("GOVERNMENT_ID"), required: true, href: "/pro/verification" },
    {
      key: "photos",
      label: `At least ${RULES.minWorkPhotosForReview} work photos`,
      done: photoCount >= RULES.minWorkPhotosForReview,
      required: true,
      href: "/pro/profile#photos",
      meta: `${Math.min(photoCount, RULES.minWorkPhotosForReview)}/${RULES.minWorkPhotosForReview}`,
    },
  ];
  if (needsLicence) {
    items.push({ key: "licence", label: "Trade licence uploaded", done: ok("TRADE_LICENCE"), required: true, href: "/pro/verification" });
  }
  items.push({ key: "payout", label: "Payout account added", done: !!payout, required: false, href: "/pro/payout" });
  const canSubmit =
    items.filter((i) => i.required).every((i) => i.done) && (provider.status === "DRAFT" || provider.status === "REJECTED");
  return { items, docs, photoCount, needsLicence, canSubmit };
}

/** Headline numbers for the overview. */
export async function proStats(providerId: string) {
  const [released, held, open] = await Promise.all([
    db.escrowJob.aggregate({ where: { providerId, status: "RELEASED" }, _sum: { payoutAmount: true }, _count: true }),
    db.escrowJob.aggregate({
      where: { providerId, status: { in: ["FUNDED", "AWAITING_RELEASE", "DISPUTED"] } },
      _sum: { payoutAmount: true },
      _count: true,
    }),
    db.quoteRequest.count({ where: { providerId, status: "PENDING" } }),
  ]);
  return {
    earned: released._sum.payoutAmount ?? 0,
    paidJobs: released._count,
    held: held._sum.payoutAmount ?? 0,
    heldJobs: held._count,
    openRequests: open,
  };
}

export function pendingRequestCount(providerId: string) {
  return db.quoteRequest.count({ where: { providerId, status: "PENDING" } });
}
