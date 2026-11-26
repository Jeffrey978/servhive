import "server-only";
import { db } from "@/lib/db";
import { AREAS, BANKS, CITY, LANDMARKS, REPORT_REASONS, RULES } from "@/lib/constants";
import { PRICE_TYPES, RESPONSE_TIMES } from "@/components/pro/constants";
import { autoReleaseDueJobs, hoursUntilAutoRelease } from "@/server/escrow";
import { getThread, listConversations } from "@/server/messaging";
import { billingState, boostState, getProviderForUser, maskAccount, proStats, readiness } from "@/server/pro";
import { getProviderBySlug, isBoosted, listCategories, listProviders, type DirectorySort } from "@/server/providers";
import { HttpError } from "@/server/api/http";
import type { Prisma, User } from "@/generated/prisma/client";

/**
 * Read models for the mobile API. Each mirrors the matching website page's
 * query (noted per function) and reuses the shared business rules (escrow
 * timing, membership visibility, readiness, billing). Every Prisma call uses an
 * explicit `select` so only named fields leave the server.
 */

const HELD = ["FUNDED", "AWAITING_RELEASE", "DISPUTED"] as const;

// ── Shared shapes ────────────────────────────────────────────────────────────

const cardSelect = {
  id: true,
  slug: true,
  businessName: true,
  subSpecialty: true,
  area: true,
  imageUrl: true,
  startingPrice: true,
  responseTime: true,
  ratingAvg: true,
  reviewCount: true,
  boostedUntil: true,
  category: { select: { id: true, name: true, icon: true } },
} satisfies Prisma.ProviderSelect;

type CardRow = Prisma.ProviderGetPayload<{ select: typeof cardSelect }> & { distanceKm?: number | null };

function card(p: CardRow) {
  return {
    id: p.id,
    slug: p.slug,
    businessName: p.businessName,
    subSpecialty: p.subSpecialty,
    area: p.area,
    imageUrl: p.imageUrl,
    startingPrice: p.startingPrice,
    responseTime: p.responseTime,
    ratingAvg: p.ratingAvg,
    reviewCount: p.reviewCount,
    boosted: isBoosted(p),
    category: p.category,
    distanceKm: p.distanceKm ?? null,
  };
}

const clientJobSelect = {
  id: true,
  ref: true,
  serviceName: true,
  amount: true,
  status: true,
  area: true,
  address: true,
  scheduledFor: true,
  markedCompleteAt: true,
  completionPhotos: true,
  releasedAt: true,
  autoReleased: true,
  createdAt: true,
  provider: { select: { businessName: true, slug: true, imageUrl: true } },
  review: { select: { id: true, rating: true } },
} satisfies Prisma.EscrowJobSelect;

const quoteSelect = {
  id: true,
  title: true,
  details: true,
  area: true,
  address: true,
  preferredDate: true,
  status: true,
  quoteAmount: true,
  quoteDuration: true,
  quoteNotes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.QuoteRequestSelect;

const reportSelect = {
  id: true,
  reason: true,
  notes: true,
  status: true,
  artisanResponse: true,
  resolutionNote: true,
  createdAt: true,
} satisfies Prisma.ReportSelect;

// ── Me & reference data ──────────────────────────────────────────────────────

/** Who is signed in, and (for artisans) a summary of their listing. Drives the app's routing. */
export async function me(user: User) {
  const provider = user.role === "ARTISAN" ? await getProviderForUser(user.id) : null;
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      area: user.area,
      onboarded: user.onboarded,
    },
    provider: provider
      ? {
          id: provider.id,
          slug: provider.slug,
          businessName: provider.businessName,
          status: provider.status,
          rejectionReason: provider.rejectionReason,
          imageUrl: provider.imageUrl,
          category: { id: provider.category.id, name: provider.category.name, requiresLicence: provider.category.requiresLicence },
          billing: billingState(provider),
          boost: boostState(provider),
        }
      : null,
  };
}

/** Option lists and rules the app's forms need (mirrors the constants the website imports). */
export async function meta() {
  const categories = await listCategories();
  return {
    city: CITY,
    areas: AREAS,
    landmarks: LANDMARKS.map((l) => ({ name: l.name, shortName: l.shortName, zone: l.zone, lat: l.lat, lng: l.lng, popular: l.popular })),
    categories: categories.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      description: c.description,
      rateFrom: c.rateFrom,
      requiresLicence: c.requiresLicence,
      count: c._count.providers,
    })),
    banks: BANKS,
    reportReasons: REPORT_REASONS,
    responseTimes: RESPONSE_TIMES,
    priceTypes: PRICE_TYPES,
    rules: RULES,
  };
}

// ── Directory & profiles (src/app/(site)/artisans) ───────────────────────────

const SORTS: DirectorySort[] = ["featured", "distance", "rating", "price", "reviews"];

function positive(raw: string) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function parseNear(raw: string) {
  const m = raw.match(/^(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  return Math.abs(lat) > 90 || Math.abs(lng) > 180 ? null : { lat, lng };
}

/** Mirrors /artisans: same filters, same visibility rule, same sorting. */
export async function directory(params: { q: string; category: string; area: string; minRating: string; maxPrice: string; sort: string; near: string; landmark: string }) {
  const landmark = params.landmark ? LANDMARKS.find((l) => l.name === params.landmark) : undefined;
  const near = landmark ? { lat: landmark.lat, lng: landmark.lng } : parseNear(params.near);
  const rows = await listProviders({
    q: params.q.slice(0, 80),
    category: params.category || undefined,
    area: (AREAS as readonly string[]).includes(params.area) ? params.area : undefined,
    minRating: positive(params.minRating),
    maxPrice: positive(params.maxPrice),
    sort: SORTS.includes(params.sort as DirectorySort) ? (params.sort as DirectorySort) : undefined,
    near,
  });
  return { providers: rows.map(card) };
}

/** Mirrors /artisans/[slug]: live profiles for everyone, a preview for the owner. */
export async function artisanProfile(user: User, slug: string) {
  const p = await getProviderBySlug(slug, { includeUnapproved: true });
  if (!p) throw new HttpError(404, "Artisan not found.");
  const isOwner = !!p.userId && p.userId === user.id;
  const isLive = p.status === "APPROVED"; // same rule as the website's profile page
  if (!isLive && !isOwner && user.role !== "ADMIN") throw new HttpError(404, "Artisan not found.");
  const canHire = user.role === "CLIENT" && !isOwner && isLive;
  const saved = canHire
    ? !!(await db.savedProvider.findUnique({ where: { userId_providerId: { userId: user.id, providerId: p.id } }, select: { userId: true } }))
    : false;
  return {
    provider: {
      id: p.id,
      slug: p.slug,
      businessName: p.businessName,
      ownerName: p.ownerName,
      subSpecialty: p.subSpecialty,
      bio: p.bio,
      area: p.area,
      areasCovered: p.areasCovered,
      imageUrl: p.imageUrl,
      startingPrice: p.startingPrice,
      responseTime: p.responseTime,
      yearsExperience: p.yearsExperience,
      ratingAvg: p.ratingAvg,
      reviewCount: p.reviewCount,
      status: p.status,
      boosted: isBoosted(p),
      category: { id: p.category.id, name: p.category.name, icon: p.category.icon },
      services: p.services.map((s) => ({ id: s.id, name: s.name, price: s.price, priceType: s.priceType, unitLabel: s.unitLabel })),
      workPhotos: p.workPhotos.map((w) => ({ id: w.id, url: w.url, caption: w.caption, area: w.area })),
      reviews: p.reviews.map((r) => ({ id: r.id, authorName: r.authorName, rating: r.rating, text: r.text, area: r.area, createdAt: r.createdAt })),
    },
    isOwner,
    isLive,
    canHire,
    saved,
    defaultArea: user.area ?? p.area,
  };
}

// ── Client (src/app/account) ─────────────────────────────────────────────────

/** Mirrors /account. */
export async function clientOverview(user: User) {
  await autoReleaseDueJobs();
  const [held, activeJobs, quotesReady, savedCount, awaiting] = await Promise.all([
    db.escrowJob.aggregate({ where: { clientId: user.id, status: { in: [...HELD] } }, _sum: { amount: true } }),
    db.escrowJob.count({ where: { clientId: user.id, status: { in: [...HELD] } } }),
    db.quoteRequest.findMany({
      where: { clientId: user.id, status: "QUOTED" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, quoteAmount: true, provider: { select: { businessName: true } } },
    }),
    db.savedProvider.count({ where: { userId: user.id } }),
    db.escrowJob.findMany({
      where: { clientId: user.id, status: "AWAITING_RELEASE" },
      orderBy: { markedCompleteAt: "asc" },
      take: 5,
      select: { id: true, serviceName: true, amount: true, status: true, markedCompleteAt: true, provider: { select: { businessName: true } } },
    }),
  ]);
  return {
    held: held._sum.amount ?? 0,
    activeJobs,
    savedCount,
    quotesReady,
    awaiting: awaiting.map((j) => ({ ...j, hoursLeft: hoursUntilAutoRelease(j) })),
  };
}

/** Mirrors /account/jobs. */
export async function clientJobs(user: User) {
  await autoReleaseDueJobs();
  const jobs = await db.escrowJob.findMany({ where: { clientId: user.id }, orderBy: { createdAt: "desc" }, select: clientJobSelect });
  const held = jobs.filter((j) => (HELD as readonly string[]).includes(j.status)).reduce((s, j) => s + j.amount, 0);
  return { held, jobs: jobs.map((j) => ({ ...j, hoursLeft: hoursUntilAutoRelease(j) })) };
}

/** Mirrors /account/quotes (quotes waiting on the client first). */
export async function clientQuotes(user: User) {
  const quotes = await db.quoteRequest.findMany({
    where: { clientId: user.id },
    orderBy: [{ updatedAt: "desc" }],
    select: { ...quoteSelect, provider: { select: { businessName: true, slug: true, imageUrl: true } }, job: { select: { ref: true } } },
  });
  quotes.sort((a, b) => Number(b.status === "QUOTED") - Number(a.status === "QUOTED"));
  return { quotes };
}

/** Mirrors /account/reports. */
export async function clientReports(user: User) {
  const reports = await db.report.findMany({
    where: { reporterId: user.id },
    orderBy: { createdAt: "desc" },
    select: { ...reportSelect, provider: { select: { businessName: true, slug: true } }, job: { select: { ref: true } } },
  });
  return { reports };
}

/** Mirrors /account/saved. */
export async function clientSaved(user: User) {
  const saved = await db.savedProvider.findMany({
    where: { userId: user.id, provider: { status: "APPROVED" } },
    orderBy: { createdAt: "desc" },
    select: { provider: { select: cardSelect } },
  });
  return { providers: saved.map((s) => card(s.provider)) };
}

// ── Artisan (src/app/pro) ────────────────────────────────────────────────────

async function myProvider(user: User) {
  const provider = await getProviderForUser(user.id);
  if (!provider) throw new HttpError(404, "No artisan profile found for this account.");
  return provider;
}

const proJobSelect = {
  id: true,
  ref: true,
  serviceName: true,
  amount: true,
  payoutAmount: true,
  status: true,
  area: true,
  address: true,
  scheduledFor: true,
  markedCompleteAt: true,
  completionPhotos: true,
  releasedAt: true,
  autoReleased: true,
  createdAt: true,
  updatedAt: true,
  client: { select: { name: true } },
} satisfies Prisma.EscrowJobSelect;

/** Mirrors /pro. */
export async function proOverview(user: User) {
  const provider = await myProvider(user);
  await autoReleaseDueJobs();
  const [stats, ready, requests, jobs] = await Promise.all([
    proStats(provider.id),
    readiness(provider),
    db.quoteRequest.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" }, take: 5, select: { ...quoteSelect, client: { select: { name: true } } } }),
    db.escrowJob.findMany({ where: { providerId: provider.id }, orderBy: { updatedAt: "desc" }, take: 5, select: proJobSelect }),
  ]);
  return {
    stats,
    readiness: { items: ready.items, canSubmit: ready.canSubmit, photoCount: ready.photoCount, needsLicence: ready.needsLicence },
    requests,
    jobs: jobs.map((j) => ({ ...j, hoursLeft: hoursUntilAutoRelease(j) })),
    billing: billingState(provider),
    boost: boostState(provider),
    status: provider.status,
    rejectionReason: provider.rejectionReason,
  };
}

/** Mirrors /pro/requests. */
export async function proRequests(user: User) {
  const provider = await myProvider(user);
  const rows = await db.quoteRequest.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { ...quoteSelect, client: { select: { name: true } } },
  });
  return {
    open: rows.filter((r) => r.status === "PENDING" || r.status === "QUOTED"),
    closed: rows.filter((r) => r.status !== "PENDING" && r.status !== "QUOTED"),
  };
}

/** Mirrors /pro/jobs. */
export async function proJobs(user: User) {
  const provider = await myProvider(user);
  await autoReleaseDueJobs();
  const jobs = await db.escrowJob.findMany({ where: { providerId: provider.id }, orderBy: { updatedAt: "desc" }, take: 200, select: proJobSelect });
  const shaped = jobs.map((j) => ({ ...j, hoursLeft: hoursUntilAutoRelease(j) }));
  return {
    active: shaped.filter((j) => (HELD as readonly string[]).includes(j.status)),
    done: shaped.filter((j) => j.status === "RELEASED" || j.status === "REFUNDED"),
  };
}

/** Mirrors /pro/complaints. */
export async function proComplaints(user: User) {
  const provider = await myProvider(user);
  const reports = await db.report.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { ...reportSelect, job: { select: { ref: true, serviceName: true } } },
  });
  return { reports };
}

/** Mirrors /pro/billing. */
export async function proBilling(user: User) {
  const provider = await myProvider(user);
  const receipts = await db.billingReceipt.findMany({
    where: { providerId: provider.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, ref: true, description: true, amount: true, status: true, createdAt: true },
  });
  return { billing: billingState(provider), boost: boostState(provider), status: provider.status, receipts };
}

/** Mirrors /pro/payout. The full account number never leaves the server. */
export async function proPayout(user: User) {
  const provider = await myProvider(user);
  const a = await db.payoutAccount.findUnique({ where: { providerId: provider.id } });
  return {
    account: a ? { bankCode: a.bankCode, bankName: a.bankName, accountNumberMasked: maskAccount(a.accountNumber), accountName: a.accountName, verified: a.verified } : null,
  };
}

/** Mirrors /pro/profile: the editable listing, services and work photos. */
export async function proProfile(user: User) {
  const provider = await myProvider(user);
  const [services, photos] = await Promise.all([
    db.service.findMany({
      where: { providerId: provider.id },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, price: true, priceType: true, unitLabel: true },
    }),
    db.workPhoto.findMany({ where: { providerId: provider.id }, orderBy: { createdAt: "desc" }, select: { id: true, url: true, caption: true, area: true } }),
  ]);
  return {
    profile: {
      slug: provider.slug,
      businessName: provider.businessName,
      subSpecialty: provider.subSpecialty,
      bio: provider.bio,
      areasCovered: provider.areasCovered,
      startingPrice: provider.startingPrice,
      responseTime: provider.responseTime,
      yearsExperience: provider.yearsExperience,
      phone: provider.phone, // the artisan's own number, shown only to them
      imageUrl: provider.imageUrl,
      status: provider.status,
      category: { id: provider.category.id, name: provider.category.name },
    },
    services,
    photos,
  };
}

/** Mirrors /pro/verification. Document files are never returned, only their status. */
export async function proVerification(user: User) {
  const provider = await myProvider(user);
  const ready = await readiness(provider);
  return {
    status: provider.status,
    rejectionReason: provider.rejectionReason,
    needsLicence: ready.needsLicence,
    canSubmit: ready.canSubmit,
    photoCount: ready.photoCount,
    items: ready.items,
    docs: ready.docs,
  };
}

// ── Messages (either side) ───────────────────────────────────────────────────

/** Mirrors /account/messages and /pro/messages. */
export async function conversations(user: User) {
  const rows = await listConversations(user);
  return {
    conversations: rows.map((r) => ({
      id: r.id,
      updatedAt: r.updatedAt,
      counterpart: { name: r.counterpart.name, avatarUrl: r.counterpart.avatarUrl, slug: r.counterpart.href?.replace("/artisans/", "") ?? null },
      lastMessage: r.lastMessage,
    })),
  };
}

/** Mirrors the thread pages; getThread already checks the caller is a participant. */
export async function thread(user: User, id: string) {
  const t = await getThread(user, id);
  return {
    id: t.id,
    side: t.side,
    counterpart: { name: t.counterpart.name, avatarUrl: t.counterpart.avatarUrl, slug: t.counterpart.href?.replace("/artisans/", "") ?? null },
    messages: t.messages,
  };
}
