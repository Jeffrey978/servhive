"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { assertRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { AREAS, BANKS, RULES } from "@/lib/constants";
import { formToObject, run, type ActionResult } from "@/lib/action";
import {
  DomainError,
  declineQuote,
  markJobComplete,
  respondToReport,
  sendQuote,
} from "@/server/escrow";
import { sendMessage } from "@/server/messaging";
import { RESPONSE_TIMES } from "@/components/pro/constants";

/**
 * Artisan (Pro portal) server actions. Every action:
 *  1. asserts the ARTISAN role inside run(),
 *  2. loads the provider by the caller's userId (never a providerId from the form),
 *  3. validates with zod and scopes child rows (service/photo/doc ids) to that provider.
 */

type Prev = ActionResult | null;

async function me() {
  const user = await assertRole("ARTISAN");
  const provider = await db.provider.findUnique({ where: { userId: user.id }, include: { category: true } });
  if (!provider) throw new DomainError("No artisan profile found for this account.");
  return { user, provider };
}

function act(fn: () => Promise<unknown>, message?: string): Promise<ActionResult> {
  return run(async () => {
    await fn();
    return undefined;
  }, message);
}

function refresh(...paths: string[]) {
  revalidatePath("/pro", "layout");
  for (const p of paths) revalidatePath(p);
}

// ── Shared validators ────────────────────────────────────────────────────────

const id = z.string().min(1, "Missing id.").max(64);
const areaEnum = z.enum(AREAS as unknown as [string, ...string[]], { message: "Choose an area from the list." });
const MAX_DATA_URL = 2_100_000; // ≈1.5MB once base64-decoded
const imageDataUrl = z
  .string({ message: "Choose an image first." })
  .min(1, "Choose an image first.")
  .max(MAX_DATA_URL, "That image is too large. Try a smaller photo.")
  .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/, "Upload a JPEG, PNG or WebP image.");
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((s) => (s ? s : null));
const optionalInt = (min: number, max: number) =>
  z.preprocess((v) => (v === "" || v === undefined ? undefined : v), z.coerce.number().int().min(min).max(max).optional());
const toArray = (v: unknown) => (v === undefined || v === "" ? [] : Array.isArray(v) ? v : [v]);

function receiptRef() {
  return `RCP-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296)
    .toString(36)
    .toUpperCase()
    .padStart(2, "0")}`;
}

// ── Requests & jobs (state transitions go through escrow.ts) ─────────────────

const QuoteSchema = z.object({
  quoteId: id,
  amount: z.coerce.number({ message: "Enter an amount." }).int("Use whole naira.").min(500, "Minimum quote is ₦500.").max(50_000_000),
  duration: z.string().trim().min(2, "Say how long the job will take.").max(60),
  notes: z.string().trim().max(1000).optional(),
});

export async function sendQuoteAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { user } = await me();
    const input = QuoteSchema.parse(formToObject(fd));
    await sendQuote(user, { ...input, notes: input.notes || undefined });
    refresh("/pro/requests");
  }, "Quote sent. The client will be notified.");
}

export async function declineQuoteAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { user } = await me();
    const { quoteId } = z.object({ quoteId: id }).parse(formToObject(fd));
    await declineQuote(user, quoteId);
    refresh("/pro/requests");
  }, "Request declined.");
}

export async function markJobCompleteAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { user } = await me();
    const { jobId } = z.object({ jobId: id }).parse(formToObject(fd));
    await markJobComplete(user, jobId);
    refresh("/pro/jobs");
  }, `Marked complete. Payment releases within ${RULES.autoReleaseHours}h unless the client disputes.`);
}

export async function respondToReportAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { user, provider } = await me();
    const input = z
      .object({ reportId: id, response: z.string().trim().min(10, "Write at least a sentence.").max(1500) })
      .parse(formToObject(fd));
    const existing = await db.report.findFirst({ where: { id: input.reportId, providerId: provider.id }, select: { artisanResponse: true } });
    if (existing?.artisanResponse) throw new DomainError("You've already responded to this complaint.");
    await respondToReport(user, input);
    refresh("/pro/complaints");
  }, "Response sent to the Servhive team.");
}

// ── Profile ──────────────────────────────────────────────────────────────────

const ProfileSchema = z.object({
  businessName: z.string().trim().min(3, "Business name is too short.").max(80),
  subSpecialty: optionalText(80),
  bio: z.string().trim().max(1200, "Keep your bio under 1,200 characters.").default(""),
  areasCovered: z.preprocess(toArray, z.array(areaEnum).min(1, "Pick at least one area you cover.").max(AREAS.length)),
  startingPrice: z.coerce
    .number({ message: "Enter a starting price." })
    .int()
    .min(RULES.minStartingPrice, `Minimum starting price is ₦${RULES.minStartingPrice.toLocaleString()}.`)
    .max(50_000_000),
  responseTime: z.enum(RESPONSE_TIMES, { message: "Choose a response time." }),
  yearsExperience: optionalInt(0, 60),
  phone: z
    .string()
    .transform((s) => s.replace(/[\s()-]/g, ""))
    .pipe(z.union([z.literal(""), z.string().regex(/^(\+?234|0)[789][01]\d{8}$/, "Enter a valid Nigerian phone number.")]))
    .optional(),
});

/** Editing never changes status — an APPROVED profile stays APPROVED. */
export async function updateProfileAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const input = ProfileSchema.parse(formToObject(fd));
    await db.provider.update({
      where: { id: provider.id },
      data: {
        businessName: input.businessName,
        subSpecialty: input.subSpecialty,
        bio: input.bio,
        areasCovered: input.areasCovered,
        startingPrice: input.startingPrice,
        responseTime: input.responseTime,
        yearsExperience: input.yearsExperience ?? null,
        phone: input.phone || null,
      },
    });
    refresh("/pro/profile", `/artisans/${provider.slug}`);
  }, "Profile saved.");
}

export async function updateProfilePhotoAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const { dataUrl } = z.object({ dataUrl: imageDataUrl }).parse(formToObject(fd));
    await db.provider.update({ where: { id: provider.id }, data: { imageUrl: dataUrl } });
    refresh("/pro/profile", `/artisans/${provider.slug}`);
  }, "Photo updated.");
}

const ServiceSchema = z
  .object({
    serviceId: z.string().max(64).optional(),
    name: z.string().trim().min(2, "Name the service.").max(80),
    price: z.coerce.number({ message: "Enter a price." }).int("Use whole naira.").min(500, "Minimum price is ₦500.").max(50_000_000),
    priceType: z.enum(["FIXED", "STARTING_FROM", "PER_UNIT", "MILESTONE"], { message: "Choose how it's priced." }),
    unitLabel: optionalText(30),
  })
  .refine((s) => s.priceType !== "PER_UNIT" || !!s.unitLabel, { message: "Say what the unit is (e.g. room, door).", path: ["unitLabel"] });

export async function saveServiceAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const input = ServiceSchema.parse(formToObject(fd));
    const data = {
      name: input.name,
      price: input.price,
      priceType: input.priceType,
      unitLabel: input.priceType === "PER_UNIT" ? input.unitLabel : null,
    };
    if (input.serviceId) {
      const res = await db.service.updateMany({ where: { id: input.serviceId, providerId: provider.id }, data });
      if (res.count === 0) throw new DomainError("Service not found.");
    } else {
      const count = await db.service.count({ where: { providerId: provider.id } });
      if (count >= 30) throw new DomainError("You can list up to 30 services.");
      await db.service.create({ data: { ...data, providerId: provider.id, sortOrder: count } });
    }
    refresh("/pro/profile", `/artisans/${provider.slug}`);
  }, "Service saved.");
}

export async function deleteServiceAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const { serviceId } = z.object({ serviceId: id }).parse(formToObject(fd));
    const res = await db.service.deleteMany({ where: { id: serviceId, providerId: provider.id } });
    if (res.count === 0) throw new DomainError("Service not found.");
    refresh("/pro/profile", `/artisans/${provider.slug}`);
  }, "Service removed.");
}

export async function addWorkPhotoAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const input = z
      .object({
        dataUrl: imageDataUrl,
        caption: z.string().trim().min(3, "Add a short caption.").max(120),
        area: z.preprocess((v) => (v === "" ? undefined : v), areaEnum.optional()),
      })
      .parse(formToObject(fd));
    const count = await db.workPhoto.count({ where: { providerId: provider.id } });
    if (count >= 24) throw new DomainError("You can show up to 24 work photos. Remove one first.");
    await db.workPhoto.create({
      data: { providerId: provider.id, url: input.dataUrl, caption: input.caption, area: input.area ?? null },
    });
    refresh("/pro/profile", "/pro/verification", `/artisans/${provider.slug}`);
  }, "Photo added.");
}

export async function deleteWorkPhotoAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const { photoId } = z.object({ photoId: id }).parse(formToObject(fd));
    const res = await db.workPhoto.deleteMany({ where: { id: photoId, providerId: provider.id } });
    if (res.count === 0) throw new DomainError("Photo not found.");
    refresh("/pro/profile", "/pro/verification", `/artisans/${provider.slug}`);
  }, "Photo removed.");
}

// ── Verification ─────────────────────────────────────────────────────────────

const DocSchema = z.object({
  kind: z.enum(["GOVERNMENT_ID", "TRADE_LICENCE"]),
  dataUrl: imageDataUrl,
  fileName: z
    .string()
    .trim()
    .max(200)
    .transform((s) => s.replace(/[^\w.\- ]/g, "").slice(0, 120) || "upload.jpg"),
  licenceNumber: optionalText(60),
});

export async function uploadDocumentAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const input = DocSchema.parse(formToObject(fd));
    if (input.kind === "TRADE_LICENCE") {
      if (!provider.category.requiresLicence) throw new DomainError("Your trade doesn't need a licence.");
      if (!input.licenceNumber || input.licenceNumber.length < 3) throw new DomainError("Enter your licence number.");
    }
    const data = {
      status: "SUBMITTED" as const,
      fileName: input.fileName,
      fileUrl: input.dataUrl,
      licenceNumber: input.kind === "TRADE_LICENCE" ? input.licenceNumber : null,
      rejectionReason: null,
      reviewedAt: null,
      submittedAt: new Date(),
    };
    await db.verificationDocument.upsert({
      where: { providerId_kind: { providerId: provider.id, kind: input.kind } },
      update: data,
      create: { ...data, providerId: provider.id, kind: input.kind },
    });
    refresh("/pro/verification");
  }, "Document uploaded.");
}

export async function submitForReviewAction(_: Prev, fd: FormData): Promise<ActionResult> {
  void fd;
  return act(async () => {
    const { provider } = await me();
    if (provider.status !== "DRAFT" && provider.status !== "REJECTED") {
      throw new DomainError(provider.status === "UNDER_REVIEW" ? "Your profile is already under review." : "Your profile can't be resubmitted.");
    }
    const [docs, photos] = await Promise.all([
      db.verificationDocument.findMany({ where: { providerId: provider.id, status: { in: ["SUBMITTED", "APPROVED"] } }, select: { kind: true } }),
      db.workPhoto.count({ where: { providerId: provider.id } }),
    ]);
    if (!docs.some((d) => d.kind === "GOVERNMENT_ID")) throw new DomainError("Upload your government ID first.");
    if (photos < RULES.minWorkPhotosForReview) {
      throw new DomainError(`Add at least ${RULES.minWorkPhotosForReview} work photos first.`);
    }
    if (provider.category.requiresLicence && !docs.some((d) => d.kind === "TRADE_LICENCE")) {
      throw new DomainError("Upload your trade licence first.");
    }
    const res = await db.provider.updateMany({
      where: { id: provider.id, status: { in: ["DRAFT", "REJECTED"] } },
      data: { status: "UNDER_REVIEW", rejectionReason: null },
    });
    if (res.count === 0) throw new DomainError("Your profile status changed. Refresh and try again.");
    refresh();
  }, "Submitted. We usually review within 1–2 working days.");
}

// ── Payout ───────────────────────────────────────────────────────────────────

const bankCodes = BANKS.map((b) => b.code) as unknown as [string, ...string[]];

export async function savePayoutAction(_: Prev, fd: FormData): Promise<ActionResult> {
  return act(async () => {
    const { provider } = await me();
    const input = z
      .object({
        bankCode: z.enum(bankCodes, { message: "Choose your bank." }),
        accountNumber: z
          .string()
          .transform((s) => s.replace(/\s/g, ""))
          .pipe(z.string().regex(/^\d{10}$/, "Account number must be exactly 10 digits.")),
        accountName: z.string().trim().min(3, "Enter the account name.").max(80),
      })
      .parse(formToObject(fd));
    const bankName = BANKS.find((b) => b.code === input.bankCode)!.name;
    const data = { ...input, bankName, verified: false };
    await db.payoutAccount.upsert({
      where: { providerId: provider.id },
      update: data,
      create: { ...data, providerId: provider.id },
    });
    refresh("/pro/payout");
  }, "Payout account saved.");
}

// ── Billing (test mode — no real money moves) ────────────────────────────────

export async function paySubscriptionAction(_: Prev, fd: FormData): Promise<ActionResult> {
  void fd;
  return act(async () => {
    const { provider } = await me();
    const now = new Date();
    const base = [now, provider.trialEndsAt, provider.subscriptionPaidUntil]
      .filter((d): d is Date => !!d)
      .reduce((a, b) => (b.getTime() > a.getTime() ? b : a));
    const until = new Date(base);
    until.setMonth(until.getMonth() + 1);
    await db.$transaction([
      db.provider.update({ where: { id: provider.id }, data: { subscriptionPaidUntil: until } }),
      db.billingReceipt.create({
        data: {
          providerId: provider.id,
          ref: receiptRef(),
          description: `Pro subscription · 1 month (to ${until.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })})`,
          amount: RULES.monthlySubscription,
        },
      }),
    ]);
    refresh("/pro/billing");
  }, "Payment recorded (test mode). Thank you.");
}

export async function buyBoostAction(_: Prev, fd: FormData): Promise<ActionResult> {
  void fd;
  return act(async () => {
    const { provider } = await me();
    if (provider.status !== "APPROVED") throw new DomainError("Boost is available once your profile is live.");
    const now = Date.now();
    const base = provider.boostedUntil && provider.boostedUntil.getTime() > now ? provider.boostedUntil.getTime() : now;
    const until = new Date(base + 7 * 86_400_000);
    await db.$transaction([
      db.provider.update({ where: { id: provider.id }, data: { boostedUntil: until } }),
      db.billingReceipt.create({
        data: { providerId: provider.id, ref: receiptRef(), description: "Profile boost · 1 week", amount: RULES.boostPricePerWeek },
      }),
    ]);
    refresh("/pro/billing", "/artisans");
  }, "Boost active for 7 days (test mode).");
}

// ── Messages ─────────────────────────────────────────────────────────────────

export async function sendProMessage(conversationId: string, body: string): Promise<ActionResult> {
  return act(async () => {
    const user = await assertRole("ARTISAN");
    await sendMessage(user, z.string().min(1).max(64).parse(conversationId), z.string().max(4000).parse(body));
    revalidatePath(`/pro/messages/${conversationId}`);
    revalidatePath("/pro/messages");
  });
}
