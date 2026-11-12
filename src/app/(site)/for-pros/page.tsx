import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroBackdrop } from "@/components/marketing/hero-backdrop";
import { NumberedRow } from "@/components/marketing/page-intro";
import { SectionHead } from "@/components/marketing/section-head";
import { PHOTOS } from "@/components/marketing/photos";
import { Magnetic } from "@/components/motion/magnetic";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { buttonVariants } from "@/components/ui/button";
import { CITY, REGULATED_CATEGORIES, RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "For pros",
  description: `Join Servhive as a verified artisan in ${CITY}. ${RULES.freeTrialMonths} months free, then ${formatNaira(RULES.monthlySubscription)}/month. ${RULES.commissionPct}% only on completed jobs.`,
};

const EXAMPLE = 50000;
const fee = Math.round((EXAMPLE * RULES.commissionPct) / 100);

const PRICING = [
  { k: "Free trial", v: `${RULES.freeTrialMonths} months`, note: "Full access from the day you're approved. No card needed." },
  {
    k: "Membership",
    v: `${formatNaira(RULES.monthlySubscription)}/mo`,
    note: "After the trial. Keeps your profile visible in search.",
  },
  { k: "Commission", v: `${RULES.commissionPct}%`, note: "Only on completed, released jobs. Nothing on quotes or cancellations." },
  {
    k: "Boost",
    v: `${formatNaira(RULES.boostPricePerWeek)}/wk`,
    note: "Optional. Puts you at the top of your trade in search for a week.",
  },
];

export default function ForProsPage() {
  return (
    <>
      {/* Hero — starts at y=0 under the transparent header. */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden text-white">
        <HeroBackdrop src={PHOTOS.solar} alt="A solar installer wiring an inverter in a client's home" scrim="bg-black/50" />
        <div className="container-x relative flex flex-1 flex-col pb-8 pt-28 md:pb-10 md:pt-32">
          <Reveal trigger="load" delay={0.5}>
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/75">
              For artisans · {CITY}
            </p>
          </Reveal>
          <div className="mt-auto pt-16">
            <SplitHeading as="h1" trigger="load" delay={0.25} className="max-w-[13ch] text-display font-medium">
              Do the work. <em className="font-serif font-normal">We&rsquo;ll</em> hold the money.
            </SplitHeading>
            <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
              <Reveal trigger="load" delay={0.7} className="lg:col-span-5">
                <p className="max-w-md text-base leading-relaxed text-white/85 md:text-lg">
                  Get found by clients across {CITY}, quote on your terms, and know the money is secured before you pick
                  up a tool.
                </p>
              </Reveal>
              <Reveal trigger="load" delay={0.85} className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end">
                <Magnetic>
                  <Link href="/sign-up?as=pro" className={buttonVariants({ variant: "accent", size: "lg" })}>
                    Join as a pro
                    <ArrowUpRight />
                  </Link>
                </Magnetic>
                <Link href="#pricing" className={buttonVariants({ variant: "glass", size: "lg" })}>
                  See pricing
                </Link>
              </Reveal>
            </div>
            <Reveal
              trigger="load"
              delay={1}
              as="ul"
              className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/75"
            >
              <li>{RULES.freeTrialMonths} months free</li>
              <li aria-hidden>·</li>
              <li>{RULES.commissionPct}% on completed jobs only</li>
              <li aria-hidden>·</li>
              <li>Paid through escrow</li>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 01 — Benefits */}
      <section className="container-x pt-24 md:pt-36">
        <SectionHead
          index="01"
          label="Why join"
          title={
            <>
              Less chasing. <em className="font-serif font-normal">More</em> work.
            </>
          }
        />
        <Reveal as="ol" stagger={0.07} className="mt-12 border-b border-border md:mt-16">
          <NumberedRow n={1} title="The money is there first">
            Clients fund escrow before you start. When they release it, you&rsquo;re paid. No more chasing balances
            after the job.
          </NumberedRow>
          <NumberedRow n={2} title="Requests, not window-shoppers">
            Every request comes with the job, the area and the timing. You reply with one fixed quote.
          </NumberedRow>
          <NumberedRow n={3} title="A profile that sells for you">
            Your work photos, services and prices, plus reviews that can only come from paid jobs.
          </NumberedRow>
          <NumberedRow n={4} title="Found where you work">
            Clients search by neighbourhood, from GRA to Woji to Choba. Show up for the areas you cover.
          </NumberedRow>
        </Reveal>
      </section>

      {/* 02 — Pricing */}
      <section id="pricing" className="container-x scroll-mt-24 pt-24 md:pt-36">
        <SectionHead
          index="02"
          label="Pricing"
          title={
            <>
              Simple, and <em className="font-serif font-normal">free</em> to start.
            </>
          }
        />
        <Reveal as="dl" stagger={0.08} className="mt-12 border-b border-border md:mt-16">
          {PRICING.map((p) => (
            <div
              key={p.k}
              data-reveal-item
              className="grid gap-2 border-t border-border py-8 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10"
            >
              <dt className="eyebrow md:col-span-3">{p.k}</dt>
              <dd className="text-h1 font-medium md:col-span-5">{p.v}</dd>
              <dd className="max-w-sm text-base leading-relaxed text-muted md:col-span-4">{p.note}</dd>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-8 grid gap-4 text-sm text-muted md:grid-cols-12" delay={0.1}>
          <p className="md:col-span-6 md:col-start-4">
            Example: a {formatNaira(EXAMPLE)} job pays you {formatNaira(EXAMPLE - fee)} after the{" "}
            {RULES.commissionPct}% commission. If membership lapses, your profile is hidden from search until it&rsquo;s
            paid. Payments currently run in test mode.
          </p>
        </Reveal>
      </section>

      {/* 03 — Verification */}
      <section className="container-x pt-24 md:pt-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="eyebrow">
              <span className="mr-3 text-fg">03</span>Getting verified
            </p>
            <SplitHeading className="mt-6 text-h1 font-medium">
              Approved by a <em className="font-serif font-normal">person</em>, not a bot.
            </SplitHeading>
            <Reveal as="ol" stagger={0.08} className="mt-10 border-b border-border">
              {[
                ["Create your profile", "Business name, trade, areas you cover and a starting price."],
                ["Upload your ID", "A government-issued photo ID. Kept private, never shown to clients."],
                [
                  "Show your work",
                  `At least ${RULES.minWorkPhotosForReview} photos of jobs you've done. ${REGULATED_CATEGORIES.length} regulated trades also need a licence.`,
                ],
                ["Go live", "Our team reviews your application. Once approved, you appear in search with a verified badge."],
              ].map(([t, b], i) => (
                <li key={t} data-reveal-item className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-border py-6">
                  <span className="pt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-lg font-medium tracking-tight">{t}</p>
                    <p className="mt-1 text-muted">{b}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
          <ParallaxImage
            src={PHOTOS.tradesman}
            alt="A carpenter in his workshop holding a drill"
            className="aspect-[4/5] rounded-card bg-surface-2 lg:col-span-5 lg:col-start-8 lg:aspect-auto lg:min-h-[40rem]"
            sizes="(min-width:1024px) 40vw, 100vw"
          />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="container-x py-24 md:py-40">
        <div className="border-t border-border pt-16 text-center md:pt-24">
          <SplitHeading className="mx-auto max-w-[14ch] text-display font-medium">
            Ready when <em className="font-serif font-normal">you</em> are.
          </SplitHeading>
          <Reveal className="mt-12 flex flex-wrap justify-center gap-3" delay={0.2}>
            <Magnetic>
              <Link href="/sign-up?as=pro" className={buttonVariants({ variant: "accent", size: "lg" })}>
                Create your pro profile
                <ArrowUpRight />
              </Link>
            </Magnetic>
            <Link href="/legal/provider" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Read the provider agreement
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
