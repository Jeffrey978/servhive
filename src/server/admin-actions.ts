"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { formToObject, run, type ActionResult } from "@/lib/action";
import { DomainError } from "@/server/escrow";
import { approvalBlockers, OPEN_REPORT } from "@/server/admin";
import { formatNaira } from "@/lib/utils";

/**
 * Admin console mutations. Every action re-checks the ADMIN role from our DB
 * (never a browser passcode), validates with zod and guards each transition on
 * the current status so double-submits and races can't skip a state.
 */

const id = z.string().trim().min(1, "Missing id.").max(64);
const reason = z
  .string({ message: "Give a reason." })
  .trim()
  .min(5, "Give a reason (at least 5 characters).")
  .max(500, "Keep it under 500 characters.");
const optionalNote = z.string().trim().max(500, "Keep it under 500 characters.").optional().default("");

/** Admin pages + the artisan's own portal. */
function refreshProviderViews(slug?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/pro", "layout");
  // Public visibility can change: directory, profile and the home page spotlight.
  revalidatePath("/artisans", "layout");
  if (slug) revalidatePath(`/artisans/${slug}`);
  revalidatePath("/");
}

function refreshReportViews() {
  revalidatePath("/admin", "layout");
  revalidatePath("/account", "layout");
  revalidatePath("/pro", "layout");
}

// ── Verification documents ───────────────────────────────────────────────────

const DocSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("APPROVE"), docId: id }),
  z.object({ decision: z.literal("REJECT"), docId: id, reason }),
]);

export async function reviewDocument(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const input = DocSchema.parse(formToObject(fd));
    const doc = await db.verificationDocument.findUnique({ where: { id: input.docId }, select: { id: true, status: true } });
    if (!doc) throw new DomainError("Document not found.");

    if (input.decision === "APPROVE") {
      const res = await db.verificationDocument.updateMany({
        where: { id: doc.id, status: { in: ["SUBMITTED", "REJECTED"] } },
        data: { status: "APPROVED", rejectionReason: null, reviewedAt: new Date() },
      });
      if (res.count !== 1) throw new DomainError("This document is already approved.");
      revalidatePath("/admin", "layout");
      revalidatePath("/pro", "layout");
      return { message: "Document approved." };
    }

    const res = await db.verificationDocument.updateMany({
      where: { id: doc.id, status: { in: ["SUBMITTED", "APPROVED"] } },
      data: { status: "REJECTED", rejectionReason: input.reason, reviewedAt: new Date() },
    });
    if (res.count !== 1) throw new DomainError("This document is already rejected.");
    revalidatePath("/admin", "layout");
    revalidatePath("/pro", "layout");
    return { message: "Document rejected. The artisan will see your reason." };
  }).then(withMessage);
}

// ── Provider status ──────────────────────────────────────────────────────────

const ProviderSchema = z.object({ providerId: id });

export async function approveProvider(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const { providerId } = ProviderSchema.parse(formToObject(fd));

    const slug = await db.$transaction(async (tx) => {
      const p = await tx.provider.findUnique({
        where: { id: providerId },
        select: {
          slug: true,
          status: true,
          category: { select: { requiresLicence: true } },
          documents: { select: { kind: true, status: true } },
          _count: { select: { workPhotos: true } },
        },
      });
      if (!p) throw new DomainError("Artisan not found.");
      const blockers = approvalBlockers({ ...p, workPhotoCount: p._count.workPhotos });
      if (blockers.length) throw new DomainError(blockers[0]!);

      // Approving the provider signs off every document still waiting for review.
      await tx.verificationDocument.updateMany({
        where: { providerId, status: "SUBMITTED" },
        data: { status: "APPROVED", reviewedAt: new Date() },
      });
      const moved = await tx.provider.updateMany({
        where: { id: providerId, status: "UNDER_REVIEW" },
        data: { status: "APPROVED", rejectionReason: null },
      });
      if (moved.count !== 1) throw new DomainError("This submission was already decided.");
      return p.slug;
    });

    refreshProviderViews(slug);
    return { message: "Approved. The profile is live with a verified badge." };
  }).then(withMessage);
}

const RejectSchema = z.object({ providerId: id, reason });

export async function rejectProvider(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const { providerId, reason: why } = RejectSchema.parse(formToObject(fd));
    const p = await db.provider.findUnique({ where: { id: providerId }, select: { slug: true } });
    if (!p) throw new DomainError("Artisan not found.");
    const moved = await db.provider.updateMany({
      where: { id: providerId, status: "UNDER_REVIEW" },
      data: { status: "REJECTED", rejectionReason: why },
    });
    if (moved.count !== 1) throw new DomainError("Only submissions under review can be rejected.");
    refreshProviderViews(p.slug);
    return { message: "Rejected. The artisan will see your reason and can resubmit." };
  }).then(withMessage);
}

const SuspendSchema = z.object({ providerId: id, note: optionalNote });

export async function suspendProvider(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const { providerId, note } = SuspendSchema.parse(formToObject(fd));
    const p = await db.provider.findUnique({ where: { id: providerId }, select: { slug: true } });
    if (!p) throw new DomainError("Artisan not found.");
    const moved = await db.provider.updateMany({
      where: { id: providerId, status: { in: ["APPROVED", "UNDER_REVIEW"] } },
      data: { status: "SUSPENDED", rejectionReason: note || null },
    });
    if (moved.count !== 1) throw new DomainError("Only live or under-review artisans can be suspended.");
    refreshProviderViews(p.slug);
    return { message: "Suspended. The profile is hidden from the marketplace." };
  }).then(withMessage);
}

export async function reinstateProvider(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const { providerId } = ProviderSchema.parse(formToObject(fd));
    const p = await db.provider.findUnique({ where: { id: providerId }, select: { slug: true } });
    if (!p) throw new DomainError("Artisan not found.");
    const moved = await db.provider.updateMany({
      where: { id: providerId, status: "SUSPENDED" },
      data: { status: "APPROVED", rejectionReason: null },
    });
    if (moved.count !== 1) throw new DomainError("Only suspended artisans can be reinstated.");
    refreshProviderViews(p.slug);
    return { message: "Reinstated. The profile is live again." };
  }).then(withMessage);
}

// ── Reports & disputes ───────────────────────────────────────────────────────

const CloseSchema = z.object({
  reportId: id,
  outcome: z.enum(["RESOLVED", "DISMISSED"]),
  note: z.string({ message: "Add a note." }).trim().min(3, "Add a short note for the record.").max(1000),
});

/** Resolve or dismiss a report that has no escrow money frozen behind it. */
export async function closeReport(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const input = CloseSchema.parse(formToObject(fd));
    const r = await db.report.findUnique({ where: { id: input.reportId }, select: { job: { select: { status: true } } } });
    if (!r) throw new DomainError("Report not found.");
    if (r.job?.status === "DISPUTED") {
      throw new DomainError("This job's escrow is frozen. Release it to the artisan or refund the client instead.");
    }
    const moved = await db.report.updateMany({
      where: { id: input.reportId, status: { in: OPEN_REPORT } },
      data: { status: input.outcome, resolutionNote: input.note },
    });
    if (moved.count !== 1) throw new DomainError("This report is already closed.");
    refreshReportViews();
    return { message: input.outcome === "RESOLVED" ? "Report resolved." : "Report dismissed." };
  }).then(withMessage);
}

const SettleSchema = z.object({
  reportId: id,
  decision: z.enum(["RELEASE", "REFUND"]),
  note: z.string({ message: "Add a note." }).trim().min(3, "Explain the decision for the record.").max(1000),
});

/**
 * Admin decision on a disputed job. Moves the escrow (DISPUTED → RELEASED | REFUNDED)
 * and resolves the report in one transaction; both writes are status-guarded.
 */
export async function settleDispute(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  return run(async () => {
    await assertRole("ADMIN");
    const input = SettleSchema.parse(formToObject(fd));

    const job = await db.$transaction(async (tx) => {
      const r = await tx.report.findUnique({
        where: { id: input.reportId },
        select: { status: true, job: { select: { id: true, amount: true, payoutAmount: true, status: true } } },
      });
      if (!r) throw new DomainError("Report not found.");
      if (!r.job) throw new DomainError("This report isn't linked to a job.");
      if (r.job.status !== "DISPUTED") throw new DomainError("This job is no longer in dispute.");

      const moved = await tx.escrowJob.updateMany({
        where: { id: r.job.id, status: "DISPUTED" },
        data: input.decision === "RELEASE" ? { status: "RELEASED", releasedAt: new Date() } : { status: "REFUNDED" },
      });
      if (moved.count !== 1) throw new DomainError("This job is no longer in dispute.");

      const outcome =
        input.decision === "RELEASE"
          ? `Escrow released to the artisan (${formatNaira(r.job.payoutAmount)} after commission).`
          : `Escrow refunded to the client (${formatNaira(r.job.amount)}).`;
      const closed = await tx.report.updateMany({
        where: { id: input.reportId, status: { in: OPEN_REPORT } },
        data: { status: "RESOLVED", resolutionNote: `${outcome} ${input.note}` },
      });
      if (closed.count !== 1) throw new DomainError("This report is already closed.");
      return r.job;
    });

    refreshReportViews();
    return {
      message:
        input.decision === "RELEASE"
          ? `Released ${formatNaira(job.payoutAmount)} to the artisan (test mode).`
          : `Refunded ${formatNaira(job.amount)} to the client (test mode).`,
    };
  }).then(withMessage);
}

/** Lift `{ message }` returned from the body into the ActionResult's message. */
function withMessage(res: ActionResult<{ message: string }>): ActionResult {
  return res.ok ? { ok: true, message: res.data?.message } : res;
}
