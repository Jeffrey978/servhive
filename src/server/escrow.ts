import "server-only";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import type { User } from "@/generated/prisma/client";

/**
 * Quote → escrow job lifecycle. Every state transition lives here so the client
 * marketplace, artisan portal and admin all enforce the same rules.
 *
 *   QuoteRequest: PENDING → QUOTED → ACCEPTED (creates EscrowJob) | DECLINED | CANCELLED
 *   EscrowJob:    FUNDED → AWAITING_RELEASE → RELEASED   (client release, or auto after 48h)
 *                 FUNDED/AWAITING_RELEASE → DISPUTED → RELEASED | REFUNDED (admin)
 *
 * Payments are simulated (no Paystack keys yet): "funding" a job records it as paid.
 */

export class DomainError extends Error {}

function jobRef() {
  return `ESC-${Math.floor(1000 + Math.random() * 9000)}${Date.now().toString(36).slice(-2).toUpperCase()}`;
}

function split(amount: number) {
  const commissionAmount = Math.round((amount * RULES.commissionPct) / 100);
  return { commissionPct: RULES.commissionPct, commissionAmount, payoutAmount: amount - commissionAmount };
}

async function providerOf(user: User) {
  const p = await db.provider.findUnique({ where: { userId: user.id } });
  if (!p) throw new DomainError("No artisan profile found for this account.");
  return p;
}

// ── Client side ──────────────────────────────────────────────────────────────

export async function requestQuote(
  client: User,
  input: { providerId: string; title: string; details: string; area: string; address: string; preferredDate?: Date | null },
) {
  const provider = await db.provider.findUnique({ where: { id: input.providerId } });
  if (!provider || provider.status !== "APPROVED") throw new DomainError("This artisan isn't taking requests right now.");
  if (provider.userId === client.id) throw new DomainError("You can't request a quote from yourself.");
  return db.quoteRequest.create({
    data: { clientId: client.id, ...input, preferredDate: input.preferredDate ?? null },
  });
}

export async function cancelQuote(client: User, quoteId: string) {
  const q = await db.quoteRequest.findFirst({ where: { id: quoteId, clientId: client.id } });
  if (!q) throw new DomainError("Quote not found.");
  if (q.status !== "PENDING" && q.status !== "QUOTED") throw new DomainError("This request can no longer be cancelled.");
  return db.quoteRequest.update({ where: { id: q.id }, data: { status: "CANCELLED" } });
}

/** Client accepts a priced quote and funds escrow. */
export async function acceptQuote(client: User, quoteId: string) {
  return db.$transaction(async (tx) => {
    const q = await tx.quoteRequest.findFirst({ where: { id: quoteId, clientId: client.id } });
    if (!q) throw new DomainError("Quote not found.");
    if (q.status !== "QUOTED" || !q.quoteAmount) throw new DomainError("This quote isn't ready to accept.");
    await tx.quoteRequest.update({ where: { id: q.id }, data: { status: "ACCEPTED" } });
    return tx.escrowJob.create({
      data: {
        ref: jobRef(),
        clientId: client.id,
        providerId: q.providerId,
        quoteRequestId: q.id,
        serviceName: q.title,
        amount: q.quoteAmount,
        ...split(q.quoteAmount),
        area: q.area,
        address: q.address,
        scheduledFor: q.preferredDate,
      },
    });
  });
}

/** Client books a listed fixed-price service directly into escrow. */
export async function bookService(
  client: User,
  input: { serviceId: string; address: string; area: string; scheduledFor?: Date | null },
) {
  const service = await db.service.findUnique({ where: { id: input.serviceId }, include: { provider: true } });
  if (!service || service.provider.status !== "APPROVED") throw new DomainError("This service isn't available.");
  if (service.provider.userId === client.id) throw new DomainError("You can't book yourself.");
  return db.escrowJob.create({
    data: {
      ref: jobRef(),
      clientId: client.id,
      providerId: service.providerId,
      serviceName: service.name,
      amount: service.price,
      ...split(service.price),
      area: input.area,
      address: input.address,
      scheduledFor: input.scheduledFor ?? null,
    },
  });
}

/** Client confirms the work and releases payment to the artisan. */
export async function releaseJob(client: User, jobId: string) {
  const job = await db.escrowJob.findFirst({ where: { id: jobId, clientId: client.id } });
  if (!job) throw new DomainError("Job not found.");
  if (job.status !== "FUNDED" && job.status !== "AWAITING_RELEASE") throw new DomainError("This payment can't be released.");
  return db.escrowJob.update({ where: { id: job.id }, data: { status: "RELEASED", releasedAt: new Date() } });
}

/** Client disputes a job inside the dispute window; freezes escrow and opens a report. */
export async function disputeJob(client: User, input: { jobId: string; reason: string; notes: string }) {
  return db.$transaction(async (tx) => {
    const job = await tx.escrowJob.findFirst({ where: { id: input.jobId, clientId: client.id } });
    if (!job) throw new DomainError("Job not found.");
    if (job.status !== "FUNDED" && job.status !== "AWAITING_RELEASE") throw new DomainError("This job can't be disputed now.");
    await tx.escrowJob.update({ where: { id: job.id }, data: { status: "DISPUTED" } });
    return tx.report.create({
      data: { reporterId: client.id, providerId: job.providerId, jobId: job.id, reason: input.reason, notes: input.notes },
    });
  });
}

/** Report an artisan without a specific job (e.g. bypass attempt in chat). */
export async function reportProvider(client: User, input: { providerId: string; reason: string; notes: string }) {
  return db.report.create({ data: { reporterId: client.id, ...input } });
}

/** One review per released job; recomputes the provider's rating. */
export async function submitReview(client: User, input: { jobId: string; rating: number; text: string }) {
  if (input.rating < 1 || input.rating > 5) throw new DomainError("Rating must be 1–5.");
  const job = await db.escrowJob.findFirst({ where: { id: input.jobId, clientId: client.id }, include: { review: true } });
  if (!job) throw new DomainError("Job not found.");
  if (job.status !== "RELEASED") throw new DomainError("You can review once the job is complete and paid.");
  if (job.review) throw new DomainError("You've already reviewed this job.");
  const rating = Math.round(input.rating);
  await db.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        providerId: job.providerId,
        authorId: client.id,
        authorName: client.name,
        jobId: job.id,
        rating,
        text: input.text,
        area: job.area,
      },
    });
    // Incremental average so imported rating history (seeded counts) is preserved.
    const p = await tx.provider.findUniqueOrThrow({ where: { id: job.providerId } });
    const count = p.reviewCount + 1;
    const avg = (p.ratingAvg * p.reviewCount + rating) / count;
    await tx.provider.update({
      where: { id: p.id },
      data: { reviewCount: count, ratingAvg: Math.round(avg * 10) / 10 },
    });
  });
}

// ── Artisan side ─────────────────────────────────────────────────────────────

export async function sendQuote(
  artisan: User,
  input: { quoteId: string; amount: number; duration: string; notes?: string },
) {
  const provider = await providerOf(artisan);
  const q = await db.quoteRequest.findFirst({ where: { id: input.quoteId, providerId: provider.id } });
  if (!q) throw new DomainError("Request not found.");
  if (q.status !== "PENDING" && q.status !== "QUOTED") throw new DomainError("This request is closed.");
  if (!Number.isFinite(input.amount) || input.amount < 500) throw new DomainError("Enter a valid quote amount.");
  return db.quoteRequest.update({
    where: { id: q.id },
    data: { status: "QUOTED", quoteAmount: Math.round(input.amount), quoteDuration: input.duration, quoteNotes: input.notes ?? null },
  });
}

export async function declineQuote(artisan: User, quoteId: string) {
  const provider = await providerOf(artisan);
  const q = await db.quoteRequest.findFirst({ where: { id: quoteId, providerId: provider.id } });
  if (!q) throw new DomainError("Request not found.");
  if (q.status !== "PENDING" && q.status !== "QUOTED") throw new DomainError("This request is closed.");
  return db.quoteRequest.update({ where: { id: q.id }, data: { status: "DECLINED" } });
}

/** Artisan marks work done → starts the 48h auto-release window. */
export async function markJobComplete(artisan: User, jobId: string) {
  const provider = await providerOf(artisan);
  const job = await db.escrowJob.findFirst({ where: { id: jobId, providerId: provider.id } });
  if (!job) throw new DomainError("Job not found.");
  if (job.status !== "FUNDED") throw new DomainError("Only in-progress jobs can be marked complete.");
  return db.escrowJob.update({ where: { id: job.id }, data: { status: "AWAITING_RELEASE", markedCompleteAt: new Date() } });
}

export async function respondToReport(artisan: User, input: { reportId: string; response: string }) {
  const provider = await providerOf(artisan);
  const r = await db.report.findFirst({ where: { id: input.reportId, providerId: provider.id } });
  if (!r) throw new DomainError("Complaint not found.");
  if (r.status === "RESOLVED" || r.status === "DISMISSED") throw new DomainError("This complaint is closed.");
  return db.report.update({ where: { id: r.id }, data: { artisanResponse: input.response, status: "ARTISAN_RESPONDED" } });
}

// ── System ───────────────────────────────────────────────────────────────────

/**
 * Release any job the artisan marked complete more than 48h ago with no dispute.
 * Called lazily on dashboard loads (no cron needed in dev); safe to call often.
 */
export async function autoReleaseDueJobs() {
  const cutoff = new Date(Date.now() - RULES.autoReleaseHours * 3600_000);
  await db.escrowJob.updateMany({
    where: { status: "AWAITING_RELEASE", markedCompleteAt: { lte: cutoff } },
    data: { status: "RELEASED", releasedAt: new Date(), autoReleased: true },
  });
}

/** Hours left before auto-release, or null if not in the window. */
export function hoursUntilAutoRelease(job: { status: string; markedCompleteAt: Date | null }) {
  if (job.status !== "AWAITING_RELEASE" || !job.markedCompleteAt) return null;
  const ms = job.markedCompleteAt.getTime() + RULES.autoReleaseHours * 3600_000 - Date.now();
  return Math.max(0, Math.ceil(ms / 3600_000));
}
