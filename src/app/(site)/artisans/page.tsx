import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { AREAS, CITY, LANDMARKS } from "@/lib/constants";
import {
  isBoosted,
  listCategories,
  listProviders,
  type DirectorySort,
} from "@/server/providers";
import { SplitHeading } from "@/components/motion/split-heading";
import { ProviderCard } from "@/components/provider-card";
import { EmptyState } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import {
  DirectoryExplorer,
  type DirectoryParams,
} from "@/components/client/directory-filters";

export const metadata: Metadata = {
  title: "Find an artisan",
  description: `ID-verified artisans across ${CITY}. Filter by trade, area, rating and price, and pay through escrow.`,
};

const SORTS: DirectorySort[] = [
  "featured",
  "distance",
  "rating",
  "price",
  "reviews",
];

function one(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
}

function parseNear(raw: string) {
  const m = raw.match(/^(-?\d{1,2}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

function positiveNumber(raw: string) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export default async function ArtisansPage({
  searchParams,
}: PageProps<"/artisans">) {
  await requireUser("/artisans");
  const sp = await searchParams;

  const params: DirectoryParams = {
    q: one(sp.q).slice(0, 80),
    category: one(sp.category),
    area: (AREAS as readonly string[]).includes(one(sp.area))
      ? one(sp.area)
      : "",
    minRating: one(sp.minRating),
    maxPrice: one(sp.maxPrice),
    sort: SORTS.includes(one(sp.sort) as DirectorySort) ? one(sp.sort) : "",
    near: one(sp.near),
    landmark: one(sp.landmark),
  };

  const landmark = params.landmark
    ? LANDMARKS.find((l) => l.name === params.landmark)
    : undefined;
  if (!landmark) params.landmark = "";
  // A chosen landmark wins over raw coordinates; invalid values are dropped from the UI state.
  const coords = landmark ? null : parseNear(params.near);
  if (!coords) params.near = "";
  const near = landmark ? { lat: landmark.lat, lng: landmark.lng } : coords;

  const [categories, providers] = await Promise.all([
    listCategories(),
    listProviders({
      q: params.q || undefined,
      category: params.category || undefined,
      area: params.area || undefined,
      minRating: positiveNumber(params.minRating),
      maxPrice: positiveNumber(params.maxPrice),
      sort: (params.sort || (near ? "distance" : "featured")) as DirectorySort,
      near,
    }),
  ]);

  const activeCategory = categories.find((c) => c.id === params.category);
  const where = landmark
    ? `near ${landmark.shortName}`
    : near
      ? "near you"
      : params.area
        ? `in ${params.area}`
        : `in ${CITY}`;

  return (
    <div className="container-x pt-32 pb-24 md:pt-40">
      <header className="grid gap-6 border-b border-border pb-10 md:grid-cols-12 md:items-end md:pb-14">
        <div className="md:col-span-8">
          <p className="eyebrow mb-5">Directory · {CITY}</p>
          <SplitHeading as="h1" trigger="load" className="text-h1 font-medium">
            Hire someone <em className="font-serif font-normal">good,</em> close
            to home.
          </SplitHeading>
        </div>
        <p className="max-w-sm text-muted md:col-span-4 md:justify-self-end">
          Every artisan here has shown us a government ID. Your money sits in
          escrow until you say the job is done.
        </p>
      </header>

      <div className="mt-8 md:mt-10">
        <DirectoryExplorer
          params={params}
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            count: c._count.providers,
          }))}
          areas={AREAS}
        >
          <div className="mt-10 flex items-baseline justify-between gap-4 border-b border-border pb-4">
            <p className="text-sm">
              <span className="font-medium">{providers.length}</span>{" "}
              <span className="text-muted">
                {activeCategory
                  ? activeCategory.name.toLowerCase()
                  : providers.length === 1
                    ? "artisan"
                    : "artisans"}{" "}
                {where}
              </span>
            </p>
            <p className="eyebrow hidden sm:block">
              ID-verified · Escrow protected
            </p>
          </div>

          {providers.length === 0 ? (
            <EmptyState
              className="mt-10"
              title="No one matches that yet"
              body="Try a nearby area, a lower rating or a broader search. New artisans join every week."
              action={
                <Link
                  href="/artisans"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Clear filters
                </Link>
              }
            />
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {providers.map((p, i) => (
                <li key={p.id}>
                  <ProviderCard
                    priority={i < 4}
                    p={{
                      ...p,
                      boosted: isBoosted(p),
                      distanceKm: near ? p.distanceKm : null,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </DirectoryExplorer>
      </div>
    </div>
  );
}
