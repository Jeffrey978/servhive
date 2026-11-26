import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageIntro, NumberedRow } from "@/components/marketing/page-intro";
import { SectionHead } from "@/components/marketing/section-head";
import { Faq, type FaqItem } from "@/components/marketing/faq";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { StatusBadge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { PHOTOS } from "@/components/marketing/photos";
import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { CLIENT_DISPUTE_STEPS, CLIENT_FAQ, CLIENT_STEPS } from "@/components/marketing/guides";

export const metadata: Metadata = {
  title: "How it works",
  description: `Every Servhive job runs through escrow: you fund it, the artisan does the work, you release payment or it auto-releases after ${RULES.autoReleaseHours} hours.`,
};

const LIFECYCLE = CLIENT_STEPS;

const EXAMPLE = 50000;

const FAQ: FaqItem[] = [...CLIENT_FAQ];

export default function HowItWorksPage() {
  return (
    <>
      <PageIntro
        eyebrow="How it works"
        title={
          <>
            Pay for the job, <em className="font-serif font-normal">not</em> the promise.
          </>
        }
        lede="Every job on Servhive runs through escrow. Your money is held until the work is done, and the artisan knows it's there before they start."
      >
        <Link href="/artisans" className={buttonVariants({ variant: "primary", size: "lg" })}>
          Find an artisan
          <ArrowUpRight />
        </Link>
      </PageIntro>

      <section className="container-x pb-24 md:pb-36">
        <SectionHead index="01" label="The lifecycle" title="Six steps, start to finish." />
        <Reveal as="ol" stagger={0.07} className="mt-12 border-b border-border md:mt-16">
          {LIFECYCLE.map((s, i) => (
            <NumberedRow key={s.title} n={i + 1} title={s.title}>
              <p>{s.body}</p>
              {s.status ? <StatusBadge status={s.status} className="mt-4" /> : null}
            </NumberedRow>
          ))}
        </Reveal>
      </section>

      <section className="container-x pb-24 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <ParallaxImage
            src={PHOTOS.interior}
            alt="A finished living room with a new POP ceiling"
            className="aspect-[4/3] rounded-card bg-surface-2 lg:col-span-5 lg:aspect-auto lg:min-h-[36rem]"
            sizes="(min-width:1024px) 40vw, 100vw"
          />
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">
              <span className="mr-3 text-fg">02</span>Disputes
            </p>
            <SplitHeading className="mt-6 text-h1 font-medium">
              When something <em className="font-serif font-normal">goes</em> wrong.
            </SplitHeading>
            <Reveal as="ol" stagger={0.08} className="mt-10 border-b border-border">
              {CLIENT_DISPUTE_STEPS.map((t, i) => (
                <li key={i} data-reveal-item className="flex gap-6 border-t border-border py-6">
                  <span className="pt-1 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-lg leading-relaxed">{t}</p>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-36">
        <SectionHead
          index="03"
          label="What it costs"
          title={
            <>
              Clients pay the quote. <em className="font-serif font-normal">That&rsquo;s</em> it.
            </>
          }
        />
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <p className="max-w-md text-lg leading-relaxed text-muted md:col-span-5">
            There is no commission, no booking fee and no card surcharge. When a job is released, the artisan receives
            the full quoted price.
          </p>
          <Reveal as="dl" stagger={0.08} className="border-t border-border md:col-span-6 md:col-start-7">
            {[
              { k: "Quoted price", v: formatNaira(EXAMPLE) },
              { k: "You pay", v: formatNaira(EXAMPLE) },
              { k: "Artisan receives", v: formatNaira(EXAMPLE), strong: true },
            ].map((r) => (
              <div key={r.k} data-reveal-item className="flex items-baseline justify-between gap-4 border-b border-border py-5">
                <dt className="text-muted">{r.k}</dt>
                <dd className={r.strong ? "text-h2 font-medium" : "text-h3 font-medium"}>{r.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container-x pb-24 md:pb-36">
        <SectionHead index="04" label="Questions" title="Things people ask first." />
        <div className="mt-12 md:mt-16 md:grid md:grid-cols-12">
          <div className="md:col-span-9 md:col-start-4">
            <Faq items={FAQ} />
          </div>
        </div>
      </section>
    </>
  );
}
