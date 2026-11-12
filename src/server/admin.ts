import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { RULES } from "@/lib/constants";
import type { DocKind, DocStatus, JobStatus, Prisma, ProviderStatus, ReportStatus } from "@/generated/prisma/client";

/**
 * Read models for the admin console. Every caller must already have passed
 * requireRole("ADMIN") / assertRole("ADMIN"); nothing here checks the session.
 */

export const PAGE_SIZE = 50;

export const PROVIDER_STATUSES = ["DRAFT", "UNDER_REVIEW", "APPROVED", "REJECTED", "SUSPENDED"] as const satisfies readonly ProviderStatus[];
export const REPORT_STATUSES = ["OPEN", "ARTISAN_RESPONDED", "RESOLVED", "DISMISSED"] as const satisfies readonly ReportStatus[];
export const JOB_STATUSES = ["FUNDED", "AWAITING_RELEASE", "RELEASED", "DISPUTED", "REFUNDED"] as const satisfies readonly JobStatus[];
export const OPEN_REPORT: ReportStatus[] = ["OPEN", "ARTISAN_RESPONDED"];
export const HELD_JOB: JobStatus[] = ["FUNDED", "AWAITING_RELEASE", "DISPUTED"];

export function pick<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === "string" && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

export function pageOf(value: unknown) {
  const n = typeof value === "string" ? Number.parseInt(value, 10) : 1;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function str(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, 80) : "";
}

/** "•••• 4821" — never show a full account number in the console. */
export function maskAccount(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, "");
  return `•••• ${digits.slice(-4) || "----"}`;
}

// ── Shell ────────────────────────────────────────────────────────────────────

export const adminNavCounts = cache(async () => {
  const [pending, reports] = await Promise.all([
    db.provider.count({ where: { status: "UNDER_REVIEW" } }),
    db.report.count({ where: { status: { in: OPEN_REPORT } } }),
  ]);
  return { pending, reports };
});

// ── Overview ─────────────────────────────────────────────────────────────────

export async function overviewData() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const [live, counts, held, commission, jobsThisMonth, pendingQueue, latestReports] = await Promise.all([
    db.provider.count({ where: { status: "APPROVED" } }),
    adminNavCounts(),
    db.escrowJob.aggregate({ where: { status: { in: HELD_JOB } }, _sum: { amount: true }, _count: true }),
    db.escrowJob.aggregate({ where: { status: "RELEASED" }, _sum: { commissionAmount: true } }),
    db.escrowJob.count({ where: { createdAt: { gte: monthStart } } }),
    db.provider.findMany({
      where: { status: "UNDER_REVIEW" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, businessName: true, area: true, updatedAt: true, category: { select: { name: true } } },
    }),
    db.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        provider: { select: { businessName: true } },
        job: { select: { status: true } },
      },
    }),
  ]);
  return {
    live,
    pending: counts.pending,
    openReports: counts.reports,
    heldAmount: held._sum.amount ?? 0,
    heldJobs: held._count,
    commission: commission._sum.commissionAmount ?? 0,
    jobsThisMonth,
    pendingQueue,
    latestReports,
  };
}

// ── Approvals ────────────────────────────────────────────────────────────────

export type ApprovalTab = "UNDER_REVIEW" | "REJECTED" | "DRAFT";

export async function listApprovals(status: ApprovalTab) {
  const [rows, counts] = await Promise.all([
    db.provider.findMany({
      where: { status },
      // The live queue is first-in, first-out; the archive tabs show the latest first.
      orderBy: { updatedAt: status === "UNDER_REVIEW" ? "asc" : "desc" },
      take: 200,
      select: {
        id: true,
        businessName: true,
        ownerName: true,
        area: true,
        imageUrl: true,
        updatedAt: true,
        rejectionReason: true,
        category: { select: { name: true, requiresLicence: true } },
        documents: { select: { kind: true, status: true } },
        _count: { select: { workPhotos: true } },
      },
    }),
    db.provider.groupBy({ by: ["status"], where: { status: { in: ["UNDER_REVIEW", "REJECTED", "DRAFT"] } }, _count: true }),
  ]);
  const count = (s: ApprovalTab) => counts.find((c) => c.status === s)?._count ?? 0;
  return { rows, counts: { UNDER_REVIEW: count("UNDER_REVIEW"), REJECTED: count("REJECTED"), DRAFT: count("DRAFT") } };
}

export async function getEvidence(id: string) {
  return db.provider.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true, createdAt: true } },
      category: true,
      documents: true,
      workPhotos: { orderBy: { createdAt: "asc" } },
      services: { orderBy: { sortOrder: "asc" } },
      payoutAccount: true,
      _count: { select: { jobs: true, reports: true } },
    },
  });
}

type ApprovalInput = {
  status: ProviderStatus;
  category: { requiresLicence: boolean };
  documents: { kind: DocKind; status: DocStatus }[];
  workPhotoCount: number;
};

/** Why a provider can't be approved yet. Empty array = ready. Shared by the evidence view and approveProvider. */
export function approvalBlockers(p: ApprovalInput): string[] {
  const out: string[] = [];
  if (p.status !== "UNDER_REVIEW") out.push("Only submissions under review can be approved.");
  const id = p.documents.find((d) => d.kind === "GOVERNMENT_ID");
  if (!id) out.push("No government ID uploaded.");
  else if (id.status !== "APPROVED" && id.status !== "SUBMITTED") out.push("The government ID was rejected. The artisan must upload a new one.");
  if (p.category.requiresLicence) {
    const lic = p.documents.find((d) => d.kind === "TRADE_LICENCE");
    if (!lic) out.push("This trade needs a licence and none was uploaded.");
    else if (lic.status === "REJECTED") out.push("The trade licence was rejected. The artisan must upload a new one.");
  }
  if (p.workPhotoCount < RULES.minWorkPhotosForReview) {
    out.push(`Needs at least ${RULES.minWorkPhotosForReview} work photos (has ${p.workPhotoCount}).`);
  }
  return out;
}

// ── Artisans directory ───────────────────────────────────────────────────────

export async function listArtisans(f: { q: string; status?: ProviderStatus; category?: string; page: number }) {
  const where: Prisma.ProviderWhereInput = {};
  if (f.status) where.status = f.status;
  if (f.category) where.categoryId = f.category;
  if (f.q) {
    where.OR = [
      { businessName: { contains: f.q, mode: "insensitive" } },
      { ownerName: { contains: f.q, mode: "insensitive" } },
    ];
  }
  const [rows, total, categories] = await Promise.all([
    db.provider.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        businessName: true,
        ownerName: true,
        area: true,
        imageUrl: true,
        status: true,
        ratingAvg: true,
        reviewCount: true,
        createdAt: true,
        category: { select: { name: true } },
        _count: { select: { jobs: true } },
      },
    }),
    db.provider.count({ where }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  return { rows, total, categories };
}

// ── Reports ──────────────────────────────────────────────────────────────────

export type ReportTab = "ACTIVE" | "ALL" | ReportStatus;

export async function listReports(tab: ReportTab, page: number) {
  const where: Prisma.ReportWhereInput =
    tab === "ALL" ? {} : tab === "ACTIVE" ? { status: { in: OPEN_REPORT } } : { status: tab };
  const [rows, total, grouped] = await Promise.all([
    db.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        reason: true,
        status: true,
        createdAt: true,
        reporter: { select: { name: true } },
        provider: { select: { businessName: true } },
        job: { select: { ref: true, status: true, amount: true } },
      },
    }),
    db.report.count({ where }),
    db.report.groupBy({ by: ["status"], _count: true }),
  ]);
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count])) as Partial<Record<ReportStatus, number>>;
  return { rows, total, counts };
}

export async function getReport(id: string) {
  return db.report.findUnique({
    where: { id },
    include: {
      reporter: { select: { name: true, email: true, phone: true } },
      provider: {
        select: {
          id: true,
          slug: true,
          businessName: true,
          ownerName: true,
          phone: true,
          status: true,
          area: true,
          category: { select: { name: true } },
          _count: { select: { reports: true } },
        },
      },
      job: true,
    },
  });
}

// ── Escrow ledger ────────────────────────────────────────────────────────────

export function ledgerWhere(f: { status?: JobStatus; q: string }): Prisma.EscrowJobWhereInput {
  const where: Prisma.EscrowJobWhereInput = {};
  if (f.status) where.status = f.status;
  if (f.q) where.ref = { contains: f.q, mode: "insensitive" };
  return where;
}

export const ledgerSelect = {
  id: true,
  ref: true,
  serviceName: true,
  amount: true,
  commissionPct: true,
  commissionAmount: true,
  payoutAmount: true,
  status: true,
  area: true,
  createdAt: true,
  markedCompleteAt: true,
  releasedAt: true,
  autoReleased: true,
  client: { select: { name: true } },
  provider: { select: { id: true, businessName: true } },
} satisfies Prisma.EscrowJobSelect;

export async function listLedger(f: { status?: JobStatus; q: string; page: number }) {
  const where = ledgerWhere(f);
  const [rows, total, grouped] = await Promise.all([
    db.escrowJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (f.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: ledgerSelect,
    }),
    db.escrowJob.count({ where }),
    db.escrowJob.groupBy({ by: ["status"], _sum: { amount: true, commissionAmount: true, payoutAmount: true }, _count: true }),
  ]);
  const sum = (statuses: JobStatus[], key: "amount" | "commissionAmount" | "payoutAmount") =>
    grouped.filter((g) => statuses.includes(g.status)).reduce((n, g) => n + (g._sum[key] ?? 0), 0);
  const count = (statuses: JobStatus[]) => grouped.filter((g) => statuses.includes(g.status)).reduce((n, g) => n + g._count, 0);
  const totals = {
    held: sum(HELD_JOB, "amount"),
    heldJobs: count(HELD_JOB),
    released: sum(["RELEASED"], "amount"),
    paidOut: sum(["RELEASED"], "payoutAmount"),
    refunded: sum(["REFUNDED"], "amount"),
    refundedJobs: count(["REFUNDED"]),
    commission: sum(["RELEASED"], "commissionAmount"),
  };
  const counts = Object.fromEntries(grouped.map((g) => [g.status, g._count])) as Partial<Record<JobStatus, number>>;
  return { rows, total, totals, counts };
}
