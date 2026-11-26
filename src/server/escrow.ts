import "server-only";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import { notifyArtisanJobFunded } from "@/server/notifications/artisan";
import { notifyUsers } from "@/server/notifications/push";
import { formatNaira } from "@/lib/utils";
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
  const q = await db.quoteRequest.create({
    data: { clientId: client.id, ...input, preferredDate: input.preferredDate ?? null },
  });
  notifyUsers([provider.userId], { title: "New quote request", body: `${client.name}: ${input.title}`, data: { type: "request", id: q.id } });
  return q;
}

export async function cancelQuote(client: User, quoteId: string) {
  const q = await db.quoteRequest.findFirst({ where: { id: quoteId, clientId: client.id } });
  if (!q) throw new DomainError("Quote not found.");
  if (q.status !== "PENDING" && q.status !== "QUOTED") throw new DomainError("This request can no longer be cancelled.");
  return db.quoteRequest.update({ where: { id: q.id }, data: { status: "CANCELLED" } });
}

/** Client accepts a priced quote and funds escrow. */
export async function acceptQuote(client: User, quoteId: string) {
  const job = await db.$transaction(async (tx) => {
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
  // After the funding commits, tell the artisan (best-effort; never blocks the booking).
  await notifyArtisanJobFunded(job.id);
  return job;
}

/** Client books a listed fixed-price service directly into escrow. */
export async function bookService(
  client: User,
  input: { serviceId: string; address: string; area: string; scheduledFor?: Date | null },
) {
  const service = await db.service.findUnique({ where: { id: input.serviceId }, include: { provider: true } });
  if (!service || service.provider.status !== "APPROVED") throw new DomainError("This service isn't available.");
  if (service.provider.userId === client.id) throw new DomainError("You can't book yourself.");
  const job = await db.escrowJob.create({
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
  await notifyArtisanJobFunded(job.id);
  return job;
}

/** Client confirms the work and releases payment to the artisan. */
export async function releaseJob(client: User, jobId: string) {
  const job = await db.escrowJob.findFirst({ where: { id: jobId, clientId: client.id } });
  if (!job) throw new DomainError("Job not found.");
  if (job.status !== "FUNDED" && job.status !== "AWAITING_RELEASE") throw new DomainError("This payment can't be released.");
  const released = await db.escrowJob.update({ where: { id: job.id }, data: { status: "RELEASED", releasedAt: new Date() } });
  const provider = await db.provider.findUnique({ where: { id: job.providerId }, select: { userId: true } });
  notifyUsers([provider?.userId], {
    title: "Payment released",
    body: `${client.name} released ${formatNaira(job.payoutAmount)} for ${job.serviceName}.`,
    data: { type: "pro-job", id: job.id },
  });
  return released;
}

/** Client disputes a job inside the dispute window; freezes escrow and opens a report. */
export async function disputeJob(client: User, input: { jobId: string; reason: string; notes: string }) {
  return db.$transaction(async (tx) => {
    const job = await tx.escrowJob.findFirst({ where: { id: input.jobId, clientId: client.id } });
    if (!job) throw new DomainError("Job not found.");
    if (job.status !== "FUNDED" && job.status !== "AWAITING_RELEASE") throw new DomainError("This job can't be disputed now.");
    await tx.escrowJob.update({ where: { id: job.id }, data: { status: "DISPUTED" } });
    const report = await tx.report.create({
      data: { reporterId: client.id, providerId: job.providerId, jobId: job.id, reason: input.reason, notes: input.notes },
    });
    const provider = await tx.provider.findUnique({ where: { id: job.providerId }, select: { userId: true } });
    notifyUsers([provider?.userId], {
      title: "A client opened a dispute",
      body: `${job.serviceName}: the payment is frozen while Servhive reviews it. Tell us your side.`,
      data: { type: "complaints" },
    });
    return report;
  });
}

/** Report an artisan without a specific job (e.g. bypass attempt in chat). */
export async function reportProvider(client: User, input: { providerId: string; reason: string; notes: string }) {
  const report = await db.report.create({ data: { reporterId: client.id, ...input } });
  const provider = await db.provider.findUnique({ where: { id: input.providerId }, select: { userId: true } });
  notifyUsers([provider?.userId], { title: "A client filed a complaint", body: `${input.reason}. You can respond in the app.`, data: { type: "complaints" } });
  return report;
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
  const updated = await db.quoteRequest.update({
    where: { id: q.id },
    data: { status: "QUOTED", quoteAmount: Math.round(input.amount), quoteDuration: input.duration, quoteNotes: input.notes ?? null },
  });
  notifyUsers([q.clientId], {
    title: `Quote from ${provider.businessName}`,
    body: `${q.title}: ${formatNaira(Math.round(input.amount))}, ${input.duration}. Accept to fund escrow.`,
    data: { type: "quote", id: q.id },
  });
  return updated;
}

export async function declineQuote(artisan: User, quoteId: string) {
  const provider = await providerOf(artisan);
  const q = await db.quoteRequest.findFirst({ where: { id: quoteId, providerId: provider.id } });
  if (!q) throw new DomainError("Request not found.");
  if (q.status !== "PENDING" && q.status !== "QUOTED") throw new DomainError("This request is closed.");
  const declined = await db.quoteRequest.update({ where: { id: q.id }, data: { status: "DECLINED" } });
  notifyUsers([q.clientId], { title: `${provider.businessName} can't take this job`, body: `${q.title}. Try another artisan.`, data: { type: "quote", id: q.id } });
  return declined;
}

/**
 * Artisan marks work done → starts the 48h auto-release window. At least one
 * proof-of-work photo is required (A.6 / Payment Protection Terms §03.4), so the
 * client has evidence before the money auto-releases.
 */
export async function markJobComplete(artisan: User, jobId: string, completionPhotos: string[]) {
  const provider = await providerOf(artisan);
  const job = await db.escrowJob.findFirst({ where: { id: jobId, providerId: provider.id } });
  if (!job) throw new DomainError("Job not found.");
  if (job.status !== "FUNDED") throw new DomainError("Only in-progress jobs can be marked complete.");
  if (completionPhotos.length === 0) throw new DomainError("Add at least one photo of the finished work before marking it complete.");
  const done = await db.escrowJob.update({
    where: { id: job.id },
    data: { status: "AWAITING_RELEASE", markedCompleteAt: new Date(), completionPhotos },
  });
  notifyUsers([job.clientId], {
    title: `${provider.businessName} finished the job`,
    body: `${job.serviceName}: check the work, then release ${formatNaira(job.amount)}. It releases automatically in ${RULES.autoReleaseHours}h unless you dispute.`,
    data: { type: "job", id: job.id },
  });
  return done;
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
  const due = await db.escrowJob.findMany({
    where: { status: "AWAITING_RELEASE", markedCompleteAt: { lte: cutoff } },
    select: { id: true, serviceName: true, payoutAmount: true, provider: { select: { userId: true } } },
  });
  for (const j of due) {
    // Status-guarded per job, so two concurrent sweeps can't both release (or both notify).
    const res = await db.escrowJob.updateMany({
      where: { id: j.id, status: "AWAITING_RELEASE" },
      data: { status: "RELEASED", releasedAt: new Date(), autoReleased: true },
    });
    if (res.count === 1) {
      notifyUsers([j.provider.userId], {
        title: "Payment released",
        body: `${formatNaira(j.payoutAmount)} for ${j.serviceName} was released automatically.`,
        data: { type: "pro-job", id: j.id },
      });
    }
  }
}

/** Hours left before auto-release, or null if not in the window. */
export function hoursUntilAutoRelease(job: { status: string; markedCompleteAt: Date | null }) {
  if (job.status !== "AWAITING_RELEASE" || !job.markedCompleteAt) return null;
  const ms = job.markedCompleteAt.getTime() + RULES.autoReleaseHours * 3600_000 - Date.now();
  return Math.max(0, Math.ceil(ms / 3600_000));
}
