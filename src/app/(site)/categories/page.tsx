import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/marketing/page-intro";
import { SectionHead } from "@/components/marketing/section-head";
import { getCategories } from "@/components/marketing/data";
import { fallbackPhoto } from "@/components/marketing/photos";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/misc";
import { buttonVariants } from "@/components/ui/button";
import { BLOCKED_CATEGORIES, CITY, REGULATED_CATEGORIES } from "@/lib/constants";
import { cn, formatNaira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Categories",
  description: `Every trade on Servhive in ${CITY}: generators, solar, POP ceilings, plumbing, hair, cleaning and more, with starting prices.`,
};

const REGULATED_IDS = new Set<string>(REGULATED_CATEGORIES.map((c) => c.id));

export default async function CategoriesPage() {
  const categories = await getCategories();
  const everyday = categories.filter((c) => !c.requiresLicence && !REGULATED_IDS.has(c.id));
  const regulated = categories.filter((c) => c.requiresLicence || REGULATED_IDS.has(c.id));

  return (
    <>
      <PageIntro
        eyebrow={`Categories · ${CITY}`}
        title={
          <>
            Every trade, <em className="font-serif font-normal">one</em> standard.
          </>
        }
        lede="Same checks for every pro, whatever the work. Pick a trade to see verified artisans near you."
      />

      <section className="container-x pb-24 md:pb-36">
        {everyday.length === 0 ? (
          <EmptyState
            title="Categories are loading soon"
            body="We couldn't load the trade list just now. You can still search the directory."
            action={
              <Link href="/artisans" className={buttonVariants({ variant: "primary" })}>
                Browse artisans
              </Link>
            }
          />
        ) : (
          <Reveal
            as="ul"
            stagger={0.05}
            className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16"
          >
            {everyday.map((c, i) => (
              <li key={c.id} data-reveal-item className={cn(i % 3 === 1 && "lg:mt-16")}>
                <Link href={`/artisans?category=${encodeURIComponent(c.id)}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-2">
                    <Image
                      src={c.imageUrl ?? fallbackPhoto(i)}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 font-mono text-[0.6875rem] text-white backdrop-blur-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute right-3 top-3 flex size-9 translate-y-1 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h2 className="truncate text-xl font-medium tracking-tight">{c.name}</h2>
                    <span className="shrink-0 font-mono text-xs text-muted">
                      {c.pros} {c.pros === 1 ? "pro" : "pros"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {c.rateFrom > 0 ? (
                      <>
                        From <span className="font-medium text-fg">{formatNaira(c.rateFrom)}</span>
                      </>
                    ) : (
                      "Quote on request"
                    )}
                  </p>
                </Link>
              </li>
            ))}
          </Reveal>
        )}
      </section>

      {regulated.length > 0 ? (
        <section className="container-x pb-24 md:pb-36">
          <SectionHead label="Regulated trades" title="Licence required." />
          <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
            <p className="max-w-md text-lg leading-relaxed text-muted md:col-span-5">
              These pros must upload a valid professional licence, checked by our team, before they can be approved.
            </p>
            <Reveal as="ul" stagger={0.06} className="border-t border-border md:col-span-6 md:col-start-7">
              {regulated.map((c) => {
                const rule = REGULATED_CATEGORIES.find((r) => r.id === c.id);
                return (
                  <li key={c.id} className="border-b border-border" data-reveal-item>
                    <Link
                      href={`/artisans?category=${encodeURIComponent(c.id)}`}
                      className="group flex items-start justify-between gap-6 py-5"
                    >
                      <span>
                        <span className="block text-lg font-medium tracking-tight">{c.name}</span>
                        <span className="mt-1 block text-sm text-muted">{rule?.reason ?? c.description}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3">
                        <span className="hidden font-mono text-xs text-muted sm:inline">
                          {c.pros} {c.pros === 1 ? "pro" : "pros"}
                        </span>
                        <ArrowUpRight className="size-4 text-muted transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="container-x pb-24 md:pb-36">
        <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted md:flex-row md:items-baseline md:gap-10">
          <p className="eyebrow shrink-0">Not listed</p>
          <p className="max-w-2xl">
            For child safeguarding, we don&rsquo;t list {BLOCKED_CATEGORIES.map((c) => c.name.toLowerCase()).join(", ")}.{" "}
            <Link href="/safety" className="text-fg underline underline-offset-4">
              Why
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
