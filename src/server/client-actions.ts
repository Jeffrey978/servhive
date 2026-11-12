"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { AREAS, REPORT_REASONS } from "@/lib/constants";
import { formToObject, run, type ActionResult } from "@/lib/action";
import {
  DomainError,
  acceptQuote,
  bookService,
  cancelQuote,
  disputeJob,
  releaseJob,
  reportProvider,
  requestQuote,
  submitReview,
} from "@/server/escrow";
import { sendMessage, startConversation } from "@/server/messaging";

/**
 * Client-side ("I want to hire") server actions. Every action re-checks the DB role,
 * validates with zod and goes through the escrow/messaging services, which scope every
 * query by the caller — ids from the form are never trusted on their own.
 */

type Result = ActionResult<void>;

const id = z.string().trim().min(1, "Missing reference.").max(64);
const area = z.enum(AREAS, { message: "Choose an area." });

/** "YYYY-MM-DD" from <input type=date>; optional; must be today or later (Lagos time). */
const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((s, ctx) => {
    if (!s) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      ctx.addIssue({ code: "custom", message: "Pick a valid date." });
      return z.NEVER;
    }
    const d = new Date(`${s}T09:00:00+01:00`);
    const today = new Date(
      new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" }) +
        "T00:00:00+01:00",
    );
    if (Number.isNaN(d.getTime()) || d < today) {
      ctx.addIssue({
        code: "custom",
        message: "Pick a date from today onwards.",
      });
      return z.NEVER;
    }
    return d;
  });

function revalidateAccount() {
  revalidatePath("/account", "layout");
}

// ── Profile: quote, book, report, save, message ─────────────────────────────

const QuoteSchema = z.object({
  providerId: id,
  title: z.string().trim().min(3, "Give the job a short title.").max(100),
  details: z
    .string()
    .trim()
    .min(10, "Describe the job in a sentence or two.")
    .max(2000),
  area,
  address: z.string().trim().min(5, "Enter the address for the job.").max(200),
  preferredDate: optionalDate,
});

export async function requestQuoteAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    const input = QuoteSchema.parse(formToObject(fd));
    await requestQuote(user, input);
    revalidateAccount();
  }, "Request sent. The artisan usually replies within a few hours.");
}

const BookSchema = z.object({
  serviceId: id,
  area,
  address: z.string().trim().min(5, "Enter the address for the job.").max(200),
  scheduledFor: optionalDate,
});

export async function bookServiceAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  const res = await run(async () => {
    const user = await assertRole("CLIENT");
    const input = BookSchema.parse(formToObject(fd));
    // Only fixed-price services can be booked straight into escrow.
    const service = await db.service.findUnique({
      where: { id: input.serviceId },
      select: { priceType: true },
    });
    if (!service || service.priceType !== "FIXED")
      throw new DomainError("This service needs a quote first.");
    await bookService(user, input);
    revalidateAccount();
  });
  if (res.ok) redirect("/account/jobs");
  return res;
}

const ReportSchema = z.object({
  providerId: id,
  reason: z.enum(REPORT_REASONS, { message: "Choose a reason." }),
  notes: z
    .string()
    .trim()
    .min(10, "Tell us what happened in a sentence or two.")
    .max(2000),
});

export async function reportProviderAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    const input = ReportSchema.parse(formToObject(fd));
    const provider = await db.provider.findUnique({
      where: { id: input.providerId },
      select: { userId: true },
    });
    if (!provider) throw new DomainError("Artisan not found.");
    if (provider.userId === user.id)
      throw new DomainError("You can't report yourself.");
    await reportProvider(user, input);
    revalidatePath("/account/reports");
  }, "Report filed. Our team reviews every report within 5 days.");
}

/** Save or unsave an artisan. Returns the new saved state. */
export async function toggleSavedAction(
  providerId: string,
): Promise<ActionResult<{ saved: boolean }>> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    const pid = id.parse(providerId);
    const key = { userId_providerId: { userId: user.id, providerId: pid } };
    const existing = await db.savedProvider.findUnique({ where: key });
    if (existing) {
      await db.savedProvider.delete({ where: key });
    } else {
      const provider = await db.provider.findUnique({
        where: { id: pid },
        select: { status: true },
      });
      if (!provider || provider.status !== "APPROVED")
        throw new DomainError("This artisan isn't available.");
      await db.savedProvider.create({
        data: { userId: user.id, providerId: pid },
      });
    }
    revalidatePath("/account/saved");
    revalidatePath("/account");
    revalidatePath("/artisans/[slug]", "page");
    return { saved: !existing };
  });
}

/** Opens (or reuses) a thread with the artisan and jumps to it. */
export async function messageProviderAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  let conversationId: string | null = null;
  const res = await run(async () => {
    const user = await assertRole("CLIENT");
    const providerId = id.parse(fd.get("providerId"));
    const c = await startConversation(user, providerId);
    conversationId = c.id;
    revalidatePath("/account/messages");
  });
  if (res.ok && conversationId) redirect(`/account/messages/${conversationId}`);
  return res;
}

// ── Messages ─────────────────────────────────────────────────────────────────

export async function sendClientMessage(
  conversationId: string,
  body: string,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    const input = z
      .object({
        conversationId: id,
        body: z.string().trim().min(1, "Message can't be empty.").max(2000),
      })
      .parse({ conversationId, body });
    await sendMessage(user, input.conversationId, input.body);
    revalidatePath(`/account/messages/${input.conversationId}`);
    revalidatePath("/account/messages");
  });
}

// ── Quotes ───────────────────────────────────────────────────────────────────

export async function acceptQuoteAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  const res = await run(async () => {
    const user = await assertRole("CLIENT");
    await acceptQuote(user, id.parse(fd.get("quoteId")));
    revalidateAccount();
  });
  if (res.ok) redirect("/account/jobs");
  return res;
}

export async function cancelQuoteAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    await cancelQuote(user, id.parse(fd.get("quoteId")));
    revalidateAccount();
  }, "Request closed.");
}

// ── Jobs & escrow ────────────────────────────────────────────────────────────

export async function releaseJobAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    await releaseJob(user, id.parse(fd.get("jobId")));
    revalidateAccount();
  }, "Payment released. Thanks for confirming.");
}

const DisputeSchema = z.object({
  jobId: id,
  reason: z.enum(REPORT_REASONS, { message: "Choose a reason." }),
  notes: z
    .string()
    .trim()
    .min(10, "Tell us what went wrong in a sentence or two.")
    .max(2000),
});

export async function disputeJobAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    await disputeJob(user, DisputeSchema.parse(formToObject(fd)));
    revalidateAccount();
  }, "Dispute opened. The payment is frozen while we review.");
}

const ReviewSchema = z.object({
  jobId: id,
  rating: z.coerce
    .number({ message: "Pick a star rating." })
    .int()
    .min(1, "Pick a star rating.")
    .max(5),
  text: z.string().trim().min(5, "Write a line about the job.").max(1000),
});

export async function submitReviewAction(
  _prev: Result | null,
  fd: FormData,
): Promise<Result> {
  return run(async () => {
    const user = await assertRole("CLIENT");
    await submitReview(user, ReviewSchema.parse(formToObject(fd)));
    revalidateAccount();
    revalidatePath("/artisans/[slug]", "page");
  }, "Review posted. Thank you.");
}
