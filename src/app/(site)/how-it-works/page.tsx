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

export const metadata: Metadata = {
  title: "How it works",
  description: `Every Servhive job runs through escrow: you fund it, the artisan does the work, you release payment or it auto-releases after ${RULES.autoReleaseHours} hours.`,
};

const LIFECYCLE = [
  {
    title: "Request a quote",
    body: "Pick an artisan and describe the job, your area and when you need it. Nothing is charged. Some pros also list fixed-price services you can book straight away.",
    status: "PENDING",
  },
  {
    title: "The artisan quotes",
    body: "They reply with one fixed price. Accept it, or cancel and ask someone else. You can cancel any time before you pay.",
    status: "QUOTED",
  },
  {
    title: "You fund escrow",
    body: "Pay the quoted amount into escrow. Servhive holds it. The artisan can see it's secured, so they turn up ready to work.",
    status: "FUNDED",
  },
  {
    title: "The work gets done",
    body: "The artisan finishes and marks the job complete in the app. That starts a clock on your side.",
    status: "AWAITING_RELEASE",
  },
  {
    title: "You release, or it releases itself",
    body: `Happy with it? Release the payment. If you do nothing for ${RULES.autoReleaseHours} hours after completion, it releases automatically.`,
    status: "RELEASED",
  },
  {
    title: "Leave a review",
    body: "Only paid jobs can be reviewed, so every rating on Servhive comes from real work.",
    status: null,
  },
] as const;

const EXAMPLE = 50000;
const commission = Math.round((EXAMPLE * RULES.commissionPct) / 100);

const FAQ: FaqItem[] = [
  {
    q: "The artisan wants me to pay cash or transfer directly. Should I?",
    a: "No. Money paid outside Servhive isn't held in escrow and we can't help you get it back. Decline, and report the request from the artisan's profile.",
  },
  {
    q: "When exactly does auto-release happen?",
    a: `${RULES.autoReleaseHours} hours after the artisan marks the job complete, unless you release it earlier or open a dispute first.`,
  },
  {
    q: "Do I pay any fee on top of the quote?",
    a: `No. You pay the quoted price. Our ${RULES.commissionPct}% commission comes out of the artisan's payout.`,
  },
  {
    q: "What happens to my money during a dispute?",
    a: `It stays frozen in escrow. Nobody can release it until an admin decides, within ${RULES.disputeDecisionDays} days, to pay the artisan or refund you.`,
  },
  {
    q: "Can I cancel after paying?",
    a: "Once escrow is funded, cancelling goes through a dispute so both sides are heard. Before that, cancel freely from your dashboard.",
  },
  {
    q: "Is real money moving yet?",
    a: "Not yet. Payments run in test mode while we connect our licensed payment partner. No card is charged.",
  },
];

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
              {[
                `Open a dispute within ${RULES.disputeWindowHours} hours of the artisan marking the job complete. The money freezes and can't auto-release.`,
                "Explain what happened in the app. The artisan gets a chance to respond.",
                `An admin reviews both sides and decides within ${RULES.disputeDecisionDays} days: release to the artisan, or refund to you.`,
              ].map((t, i) => (
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
            Servhive earns a {RULES.commissionPct}% commission, taken from the artisan&rsquo;s payout when a job is
            released. There is no booking fee and no card surcharge for clients.
          </p>
          <Reveal as="dl" stagger={0.08} className="border-t border-border md:col-span-6 md:col-start-7">
            {[
              { k: "Quoted price", v: formatNaira(EXAMPLE) },
              { k: "You pay", v: formatNaira(EXAMPLE) },
              { k: `Commission (${RULES.commissionPct}%)`, v: `− ${formatNaira(commission)}` },
              { k: "Artisan receives", v: formatNaira(EXAMPLE - commission), strong: true },
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
