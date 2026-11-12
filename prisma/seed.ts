/**
 * Seeds categories + the 18 launch artisans from the legacy prototype (prisma/data/legacy-seed.json).
 * Idempotent: re-running upserts by id/slug. Run with `npx prisma db seed`.
 */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient, type PriceType } from "../src/generated/prisma/client";
import { createAdapter } from "../src/lib/db-adapter";
import { LANDMARKS, CITY_CENTER, REGULATED_CATEGORIES } from "../src/lib/constants";

const db = new PrismaClient({ adapter: createAdapter(process.env.DATABASE_URL!) });

type LegacyCategory = { id: string; name: string; icon: string; rateFrom?: string; desc?: string };
type LegacyProvider = {
  id: string;
  name: string;
  businessName: string;
  category: string;
  subSpecialty?: string;
  area: string;
  rating: number;
  reviewCount: number;
  boosted?: boolean;
  image: string;
  startingPrice: number;
  responseTime: string;
  bio: string;
  areasCovered: string[];
  workPhotos: { url: string; caption: string; area?: string }[];
  services: { name: string; price: number; type: string }[];
};

const data = JSON.parse(readFileSync(join(__dirname, "data/legacy-seed.json"), "utf8")) as {
  INITIAL_CATEGORIES: LegacyCategory[];
  INITIAL_PROVIDERS: LegacyProvider[];
};

// Legacy used feather-style names; map to lucide-react names (see src/components/category-icon.tsx).
const ICON: Record<string, string> = { home: "house", tool: "wrench", grid: "layout-grid" };

function parseNaira(s?: string) {
  return s ? Number(s.replace(/[^\d]/g, "")) || 0 : 0;
}

function priceType(t: string): { priceType: PriceType; unitLabel: string | null } {
  const v = t.toLowerCase();
  if (v.startsWith("milestone")) return { priceType: "MILESTONE", unitLabel: null };
  if (v.startsWith("starting")) return { priceType: "STARTING_FROM", unitLabel: null };
  if (v.startsWith("per ")) return { priceType: "PER_UNIT", unitLabel: v.slice(4) };
  if (v === "unit rate") return { priceType: "PER_UNIT", unitLabel: "unit" };
  return { priceType: "FIXED", unitLabel: null };
}

function coords(area: string, i: number) {
  const hit = LANDMARKS.find((l) => l.zone.toLowerCase() === area.toLowerCase()) ?? CITY_CENTER;
  // small deterministic jitter so pins in the same zone don't stack
  return { lat: hit.lat + ((i % 5) - 2) * 0.0021, lng: hit.lng + ((i % 3) - 1) * 0.0027 };
}

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .slice(0, 60);
}

const REVIEW_LINES = [
  "Arrived on time, explained everything before starting and left the place clean. Escrow made it stress-free.",
  "Very professional. Price matched the quote exactly — no last-minute 'extra'. Will book again.",
  "Good work and polite team. Took a little longer than planned but kept me updated throughout.",
  "Solid job. Fixed what two others couldn't. Highly recommend in PH.",
];
const REVIEWERS = ["Ibiere A.", "Chinedu O.", "Tamuno W.", "Blessing E.", "Kelechi N.", "Ebiere D."];

async function main() {
  const providers = data.INITIAL_PROVIDERS;

  // Categories (skip the synthetic "all")
  const cats = data.INITIAL_CATEGORIES.filter((c) => c.id !== "all");
  for (const [i, c] of cats.entries()) {
    const cover = providers.find((p) => p.category === c.id)?.image ?? null;
    const row = {
      name: c.name,
      icon: ICON[c.icon] ?? c.icon,
      description: c.desc ?? "",
      rateFrom: parseNaira(c.rateFrom),
      sortOrder: i,
      imageUrl: cover,
      requiresLicence: false,
    };
    await db.category.upsert({ where: { id: c.id }, update: row, create: { id: c.id, ...row } });
  }
  // Regulated trades: listed, but need a licence before approval.
  for (const [i, c] of REGULATED_CATEGORIES.entries()) {
    const row = { name: c.name, icon: "badge-check", description: c.reason, rateFrom: 0, sortOrder: 100 + i, requiresLicence: true };
    await db.category.upsert({ where: { id: c.id }, update: row, create: { id: c.id, ...row } });
  }

  const now = Date.now();
  for (const [i, p] of providers.entries()) {
    const s = slug(p.businessName);
    const base = {
      businessName: p.businessName,
      ownerName: p.name,
      categoryId: p.category,
      subSpecialty: p.subSpecialty ?? null,
      bio: p.bio,
      area: p.area,
      areasCovered: p.areasCovered,
      imageUrl: p.image,
      startingPrice: p.startingPrice,
      responseTime: p.responseTime,
      yearsExperience: 4 + (i % 9),
      status: "APPROVED" as const,
      ratingAvg: p.rating,
      reviewCount: p.reviewCount,
      boostedUntil: p.boosted ? new Date(now + 30 * 86400_000) : null,
      ...coords(p.area, i),
    };
    const provider = await db.provider.upsert({ where: { slug: s }, update: base, create: { slug: s, ...base } });

    // Children are replaced wholesale so the seed stays idempotent.
    await db.service.deleteMany({ where: { providerId: provider.id } });
    await db.workPhoto.deleteMany({ where: { providerId: provider.id } });
    await db.review.deleteMany({ where: { providerId: provider.id, jobId: null, authorId: null } });

    await db.service.createMany({
      data: p.services.map((sv, j) => ({ providerId: provider.id, name: sv.name, price: sv.price, sortOrder: j, ...priceType(sv.type) })),
    });
    await db.workPhoto.createMany({
      data: p.workPhotos.map((w, j) => ({
        providerId: provider.id,
        url: w.url,
        caption: w.caption.replace(/^✔\s*Completed:\s*/i, ""),
        area: w.area ?? p.area,
        createdAt: new Date(now - (j + 1) * 12 * 86400_000),
      })),
    });
    // A few representative reviews; ratingAvg/reviewCount above carry the imported history.
    await db.review.createMany({
      data: [0, 1, 2].map((j) => ({
        providerId: provider.id,
        authorName: REVIEWERS[(i + j) % REVIEWERS.length]!,
        rating: j === 2 && p.rating < 4.8 ? 4 : 5,
        text: REVIEW_LINES[(i + j) % REVIEW_LINES.length]!,
        area: p.areasCovered[j % p.areasCovered.length] ?? p.area,
        createdAt: new Date(now - (j * 9 + i + 2) * 86400_000),
      })),
    });
  }

  console.log(`Seeded ${cats.length + REGULATED_CATEGORIES.length} categories and ${providers.length} artisans.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
