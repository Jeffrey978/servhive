import "server-only";
import { db } from "@/lib/db";
import { distanceKm } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Public read model for artisans. Only APPROVED providers are ever listed publicly.
 * Shared by the landing page (spotlight) and the directory.
 */

export const providerCardSelect = {
  id: true,
  slug: true,
  businessName: true,
  ownerName: true,
  subSpecialty: true,
  area: true,
  imageUrl: true,
  startingPrice: true,
  responseTime: true,
  ratingAvg: true,
  reviewCount: true,
  boostedUntil: true,
  status: true,
  lat: true,
  lng: true,
  category: { select: { id: true, name: true, icon: true } },
} satisfies Prisma.ProviderSelect;

export type ProviderCardData = Prisma.ProviderGetPayload<{ select: typeof providerCardSelect }> & {
  distanceKm?: number | null;
};

export function isBoosted(p: { boostedUntil: Date | null }) {
  return !!p.boostedUntil && p.boostedUntil.getTime() > Date.now();
}

export type DirectorySort = "featured" | "distance" | "rating" | "price" | "reviews";

export type DirectoryFilters = {
  q?: string;
  category?: string;
  area?: string;
  minRating?: number;
  maxPrice?: number;
  sort?: DirectorySort;
  /** Searcher's position (geolocation or chosen landmark) for distance sort/labels. */
  near?: { lat: number; lng: number } | null;
};

export async function listProviders(f: DirectoryFilters = {}): Promise<ProviderCardData[]> {
  const where: Prisma.ProviderWhereInput = { status: "APPROVED" };
  if (f.category && f.category !== "all") where.categoryId = f.category;
  if (f.area) where.OR = [{ area: f.area }, { areasCovered: { has: f.area } }];
  if (f.minRating) where.ratingAvg = { gte: f.minRating };
  if (f.maxPrice) where.startingPrice = { lte: f.maxPrice };
  if (f.q?.trim()) {
    const q = f.q.trim();
    where.AND = [
      {
        OR: [
          { businessName: { contains: q, mode: "insensitive" } },
          { ownerName: { contains: q, mode: "insensitive" } },
          { subSpecialty: { contains: q, mode: "insensitive" } },
          { bio: { contains: q, mode: "insensitive" } },
          { category: { name: { contains: q, mode: "insensitive" } } },
          { services: { some: { name: { contains: q, mode: "insensitive" } } } },
        ],
      },
    ];
  }

  const rows: ProviderCardData[] = await db.provider.findMany({ where, select: providerCardSelect, take: 200 });

  if (f.near) {
    for (const r of rows) r.distanceKm = r.lat != null && r.lng != null ? distanceKm(f.near, { lat: r.lat, lng: r.lng }) : null;
  }

  const sort = f.sort ?? "featured";
  const by: Record<DirectorySort, (a: ProviderCardData, b: ProviderCardData) => number> = {
    featured: (a, b) =>
      Number(isBoosted(b)) - Number(isBoosted(a)) || b.ratingAvg * Math.log(b.reviewCount + 2) - a.ratingAvg * Math.log(a.reviewCount + 2),
    distance: (a, b) => (a.distanceKm ?? 1e9) - (b.distanceKm ?? 1e9),
    rating: (a, b) => b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount,
    price: (a, b) => a.startingPrice - b.startingPrice,
    reviews: (a, b) => b.reviewCount - a.reviewCount,
  };
  return rows.sort(by[sort]);
}

/** Boosted + top-rated, for the landing spotlight. */
export async function spotlightProviders(limit = 8) {
  const all = await listProviders({ sort: "featured" });
  return all.slice(0, limit);
}

export async function listCategories() {
  return db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { providers: { where: { status: "APPROVED" } } } } },
  });
}

/** Full public profile. Returns null for non-approved providers (unless `includeUnapproved`, for owner/admin previews). */
export async function getProviderBySlug(slug: string, opts: { includeUnapproved?: boolean } = {}) {
  const p = await db.provider.findUnique({
    where: { slug },
    include: {
      category: true,
      services: { orderBy: { sortOrder: "asc" } },
      workPhotos: { orderBy: { createdAt: "desc" } },
      reviews: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!p) return null;
  if (p.status !== "APPROVED" && !opts.includeUnapproved) return null;
  return p;
}

export async function marketplaceStats() {
  const [artisans, categories, released] = await Promise.all([
    db.provider.count({ where: { status: "APPROVED" } }),
    db.category.count(),
    db.escrowJob.count({ where: { status: "RELEASED" } }),
  ]);
  const agg = await db.provider.aggregate({ where: { status: "APPROVED" }, _avg: { ratingAvg: true }, _sum: { reviewCount: true } });
  return {
    artisans,
    categories,
    jobsCompleted: released + (agg._sum.reviewCount ?? 0),
    avgRating: Math.round((agg._avg.ratingAvg ?? 0) * 10) / 10,
  };
}
