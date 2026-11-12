import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ArrowLeft, BadgeCheck, Clock, Hammer, MapPin } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProviderBySlug } from "@/server/providers";
import { formatDate, formatNaira } from "@/lib/utils";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { Stars } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import {
  BookServiceButton,
  HireRail,
  ReportArtisanButton,
} from "@/components/client/profile-actions";
import { WorkGallery } from "@/components/client/work-gallery";
import type { PriceType } from "@/generated/prisma/client";

const loadProvider = cache((slug: string) =>
  getProviderBySlug(slug, { includeUnapproved: true }),
);

export async function generateMetadata({
  params,
}: PageProps<"/artisans/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadProvider(slug);
  if (!p || p.status !== "APPROVED") return { title: "Artisan not found" };
  return {
    title: `${p.businessName}, ${p.category.name} in ${p.area}`,
    description: p.bio
      ? p.bio.slice(0, 155)
      : `${p.category.name} in ${p.area}, Port Harcourt. ID-verified, paid through escrow.`,
  };
}

function priceLabel(s: {
  price: number;
  priceType: PriceType;
  unitLabel: string | null;
}) {
  const n = formatNaira(s.price);
  switch (s.priceType) {
    case "STARTING_FROM":
      return `From ${n}`;
    case "PER_UNIT":
      return `${n} per ${s.unitLabel || "unit"}`;
    case "MILESTONE":
      return `${n} per milestone`;
    default:
      return n;
  }
}

function lagosToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Lagos" });
}

export default async function ArtisanProfilePage({
  params,
}: PageProps<"/artisans/[slug]">) {
  const { slug } = await params;
  const user = await requireUser(`/artisans/${slug}`);
  const p = await loadProvider(slug);
  if (!p) notFound();

  const isOwner = !!p.userId && p.userId === user.id;
  const isLive = p.status === "APPROVED";
  if (!isLive && !isOwner && user.role !== "ADMIN") notFound();

  const canHire = user.role === "CLIENT" && !isOwner && isLive;
  const saved = canHire
    ? !!(await db.savedProvider.findUnique({
        where: { userId_providerId: { userId: user.id, providerId: p.id } },
        select: { userId: true },
      }))
    : false;
  const today = lagosToday();
  const defaultArea = user.area ?? p.area;

  const facts = [
    { icon: MapPin, label: p.area },
    { icon: Clock, label: `Replies ${p.responseTime}` },
    ...(p.yearsExperience != null
      ? [{ icon: Hammer, label: `${p.yearsExperience} yrs experience` }]
      : []),
  ];

  return (
    <div className="pt-24 pb-24 md:pt-28">
      {!isLive ? (
        <div className="container-x mb-4">
          <p className="rounded-xl bg-info-soft px-4 py-3 text-sm text-info">
            Preview only. This profile isn&apos;t live yet, so clients
            can&apos;t see it.
          </p>
        </div>
      ) : null}

      <div className="container-x">
        <Link
          href="/artisans"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" /> All artisans
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-card bg-surface-2">
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
            {p.imageUrl ? (
              <Image
                src={p.imageUrl}
                alt={p.businessName}
                fill
                priority
                sizes="(min-width:1440px) 90rem, 100vw"
                className="object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8 md:p-12">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/75">
                {p.category.name}
                {p.subSpecialty ? ` · ${p.subSpecialty}` : ""}
              </p>
              <SplitHeading
                as="h1"
                trigger="load"
                className="mt-3 max-w-4xl text-h1 font-medium"
              >
                {p.businessName}
              </SplitHeading>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
                {isLive ? (
                  <span className="inline-flex items-center gap-1.5 font-medium text-white">
                    <BadgeCheck className="size-4 text-accent" /> ID-verified
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <Stars value={p.ratingAvg} className="text-white" />
                  <span className="text-white/70">
                    ({p.reviewCount} reviews)
                  </span>
                </span>
                {facts.map((f) => (
                  <span
                    key={f.label}
                    className="inline-flex items-center gap-1.5"
                  >
                    <f.icon className="size-4" /> {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
          {/* Rail: first on mobile, sticky right on desktop */}
          <aside className="lg:order-2">
            <div className="lg:sticky lg:top-28">
              {canHire ? (
                <HireRail
                  provider={{
                    id: p.id,
                    businessName: p.businessName,
                    startingPrice: p.startingPrice,
                    area: defaultArea,
                  }}
                  saved={saved}
                  today={today}
                />
              ) : (
                <div className="rounded-card border border-border bg-surface p-5 md:p-6">
                  <p className="eyebrow">Starting from</p>
                  <p className="mt-2 text-h2 font-medium">
                    {formatNaira(p.startingPrice)}
                  </p>
                  <p className="mt-3 text-sm text-muted">
                    {isOwner
                      ? "This is how clients see your profile."
                      : "Hiring is available on client accounts."}
                  </p>
                  {isOwner ? (
                    <Link
                      href="/pro"
                      className={buttonVariants({
                        variant: "primary",
                        className: "mt-5 w-full",
                      })}
                    >
                      Go to Pro portal
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0 space-y-16 lg:order-1">
            <section aria-labelledby="about">
              <p id="about" className="eyebrow mb-4">
                About
              </p>
              <p className="max-w-2xl text-xl leading-relaxed md:text-2xl">
                {p.bio ||
                  `${p.ownerName} runs ${p.businessName}, working across ${p.area} and nearby.`}
              </p>
              <p className="mt-4 text-sm text-muted">Run by {p.ownerName}</p>
              {p.areasCovered.length ? (
                <div className="mt-8">
                  <p className="mb-3 text-sm font-medium">Areas covered</p>
                  <ul className="flex flex-wrap gap-2">
                    {p.areasCovered.map((a) => (
                      <li
                        key={a}
                        className="rounded-full border border-border px-3.5 py-1.5 text-sm"
                      >
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <section aria-labelledby="services">
              <div className="mb-2 flex items-baseline justify-between border-b border-border-strong pb-4">
                <h2 id="services" className="text-h3 font-medium">
                  Services
                </h2>
                <span className="eyebrow">{p.services.length} listed</span>
              </div>
              {p.services.length === 0 ? (
                <p className="py-6 text-muted">
                  No fixed prices listed yet. Request a quote for your job.
                </p>
              ) : (
                <ol>
                  {p.services.map((s, i) => (
                    <li
                      key={s.id}
                      className="grid grid-cols-[2rem_1fr_auto] items-center gap-x-3 gap-y-1 border-b border-border py-5 sm:grid-cols-[2.5rem_1fr_auto_auto] sm:gap-x-6"
                    >
                      <span className="eyebrow col-start-1 row-start-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="col-start-2 row-start-1 font-medium">
                        {s.name}
                      </span>
                      <span className="col-start-2 row-start-2 text-sm text-muted sm:col-start-3 sm:row-start-1 sm:text-base sm:text-fg">
                        {priceLabel(s)}
                      </span>
                      <span className="col-start-3 row-span-2 row-start-1 sm:col-start-4 sm:row-span-1">
                        {canHire && s.priceType === "FIXED" ? (
                          <BookServiceButton
                            service={{ id: s.id, name: s.name, price: s.price }}
                            providerName={p.businessName}
                            defaultArea={defaultArea}
                            today={today}
                          />
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {p.workPhotos.length ? (
              <section aria-labelledby="work">
                <div className="mb-6 flex items-baseline justify-between">
                  <h2 id="work" className="text-h3 font-medium">
                    Recent <em className="font-serif font-normal">work</em>
                  </h2>
                  <span className="eyebrow">{p.workPhotos.length} photos</span>
                </div>
                <WorkGallery
                  photos={p.workPhotos.map((w) => ({
                    id: w.id,
                    url: w.url,
                    caption: w.caption,
                    area: w.area,
                  }))}
                />
              </section>
            ) : null}

            <section aria-labelledby="reviews">
              <div className="mb-2 flex items-baseline justify-between border-b border-border-strong pb-4">
                <h2 id="reviews" className="text-h3 font-medium">
                  Reviews
                </h2>
                <Stars value={p.ratingAvg} />
              </div>
              {p.reviews.length === 0 ? (
                <p className="py-6 text-muted">
                  No reviews yet. Reviews come only from jobs paid through
                  Servhive.
                </p>
              ) : (
                <Reveal as="ul" stagger={0.06}>
                  {p.reviews.map((r) => (
                    <li
                      key={r.id}
                      data-reveal-item
                      className="border-b border-border py-6"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-medium">
                          {r.authorName}
                          {r.area ? (
                            <span className="font-normal text-muted">
                              {" "}
                              · {r.area}
                            </span>
                          ) : null}
                        </p>
                        <span className="shrink-0 text-sm text-muted">
                          {formatDate(r.createdAt)}
                        </span>
                      </div>
                      <p
                        className="mt-1 text-sm"
                        aria-label={`${r.rating} out of 5`}
                      >
                        <span className="text-accent">
                          {"★".repeat(r.rating)}
                        </span>
                        <span className="text-border-strong">
                          {"★".repeat(5 - r.rating)}
                        </span>
                      </p>
                      <p className="mt-3 max-w-2xl leading-relaxed text-fg/90">
                        {r.text}
                      </p>
                    </li>
                  ))}
                </Reveal>
              )}
            </section>

            {canHire ? (
              <div className="border-t border-border pt-6">
                <ReportArtisanButton
                  providerId={p.id}
                  providerName={p.businessName}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
