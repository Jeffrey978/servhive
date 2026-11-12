import "server-only";
import type { ProviderCardData } from "@/server/providers";

/**
 * Resilient loaders for the marketing pages. The DB can be empty or unreachable
 * (no DATABASE_URL at build time, cold Neon branch…): every loader falls back to
 * empty data so sections simply hide instead of crashing the page.
 *
 * Modules are imported lazily so a failing DB client import is caught here too.
 */

export type MarketingCategory = {
  id: string;
  name: string;
  description: string;
  rateFrom: number;
  requiresLicence: boolean;
  imageUrl: string | null;
  pros: number;
};

export type MarketplaceStats = {
  artisans: number;
  categories: number;
  jobsCompleted: number;
  avgRating: number;
};

export type FeaturedReview = { text: string; authorName: string; area: string | null; trade: string };

async function safe<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[marketing] data unavailable:", (err as Error).message);
    return fallback;
  }
}

export function getCategories(): Promise<MarketingCategory[]> {
  return safe(async () => {
    const { listCategories } = await import("@/server/providers");
    const rows = await listCategories();
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      rateFrom: c.rateFrom,
      requiresLicence: c.requiresLicence,
      imageUrl: c.imageUrl,
      pros: c._count.providers,
    }));
  }, []);
}

export function getSpotlight(limit = 8): Promise<(ProviderCardData & { boosted: boolean })[]> {
  return safe(async () => {
    const { spotlightProviders, isBoosted } = await import("@/server/providers");
    const rows = await spotlightProviders(limit);
    return rows.map((p) => ({ ...p, boosted: isBoosted(p) }));
  }, []);
}

export function getStats(): Promise<MarketplaceStats | null> {
  return safe(async () => {
    const { marketplaceStats } = await import("@/server/providers");
    return marketplaceStats();
  }, null);
}

/** Most recent five-star review with enough substance to quote. */
export function getFeaturedReview(): Promise<FeaturedReview | null> {
  return safe(async () => {
    const { db } = await import("@/lib/db");
    const r = await db.review.findFirst({
      where: { rating: 5, provider: { status: "APPROVED" } },
      orderBy: { createdAt: "desc" },
      select: { text: true, authorName: true, area: true, provider: { select: { category: { select: { name: true } } } } },
    });
    if (!r || r.text.trim().length < 24) return null;
    return { text: r.text.trim(), authorName: r.authorName, area: r.area, trade: r.provider.category.name };
  }, null);
}
