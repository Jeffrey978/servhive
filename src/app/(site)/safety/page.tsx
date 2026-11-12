import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, NumberedRow } from "@/components/marketing/page-intro";
import { SectionHead, ArrowLink } from "@/components/marketing/section-head";
import { PHOTOS } from "@/components/marketing/photos";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { BLOCKED_CATEGORIES, REGULATED_CATEGORIES, REPORT_REASONS, RULES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Safety & trust",
  description:
    "How Servhive verifies artisans, protects payments with escrow, handles reports and keeps some trades off the platform entirely.",
};

export default function SafetyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Safety & trust"
        title={
          <>
            Trust is <em className="font-serif font-normal">checked</em>, not assumed.
          </>
        }
        lede="Every artisan is reviewed by a person before they appear in search. Every payment sits in escrow. Here is exactly what we check and what we do when something goes wrong."
      />

      {/* 01 — Verification */}
      <section className="container-x pb-24 md:pb-36">
        <SectionHead index="01" label="Verification" title="Before anyone gets a badge." />
        <Reveal as="ol" stagger={0.07} className="mt-12 border-b border-border md:mt-16">
          <NumberedRow n={1} title="Government ID">
            A valid NIN slip, driver&rsquo;s licence, voter&rsquo;s card or international passport. Stored privately for
            checks only and never shown on a profile.
          </NumberedRow>
          <NumberedRow n={2} title="Proof of real work">
            At least {RULES.minWorkPhotosForReview} photos of jobs they have done themselves, so you can judge the
            finish before you hire.
          </NumberedRow>
          <NumberedRow n={3} title="Licences for regulated trades">
            Some work needs a professional licence. We won&rsquo;t approve these trades without one:{" "}
            {REGULATED_CATEGORIES.map((c) => c.name).join(", ")}.
          </NumberedRow>
          <NumberedRow n={4} title="A human review">
            Our team checks each application. Profiles stay hidden until they are approved, and can be suspended at
            any time.
          </NumberedRow>
        </Reveal>
      </section>

      {/* 02 — Escrow */}
      <section className="container-x pb-24 md:pb-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <p className="eyebrow">
              <span className="mr-3 text-fg">02</span>Escrow
            </p>
            <SplitHeading className="mt-6 text-h1 font-medium">
              Your money <em className="font-serif font-normal">waits</em> for the work.
            </SplitHeading>
            <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-muted" delay={0.15}>
              <p>
                You pay into escrow, not to the artisan. It is only released when you confirm the job, or{" "}
                {RULES.autoReleaseHours} hours after completion if you raise nothing.
              </p>
              <p>
                Open a dispute within {RULES.disputeWindowHours} hours and the money freezes until an admin decides,
                within {RULES.disputeDecisionDays} days.
              </p>
            </Reveal>
            <Reveal className="mt-10" delay={0.25}>
              <ArrowLink href="/how-it-works">See the full process</ArrowLink>
            </Reveal>
          </div>
          <ParallaxImage
            src={PHOTOS.solar}
            alt="A solar technician wiring an inverter"
            className="aspect-[4/3] rounded-card bg-surface-2 lg:col-span-6 lg:col-start-7 lg:aspect-[4/5]"
            sizes="(min-width:1024px) 50vw, 100vw"
          />
        </div>
      </section>

      {/* 03 — Bypass warning */}
      <section className="container-x pb-24 md:pb-36">
        <div className="border-y border-border-strong py-14 md:py-20">
          <p className="eyebrow flex items-center gap-3">
            <span className="size-2 rounded-full bg-danger" aria-hidden />
            <span>
              <span className="mr-3 text-fg">03</span>Never pay outside the app
            </span>
          </p>
          <SplitHeading className="mt-8 max-w-[22ch] text-h1 font-medium">
            Cash or transfer to the artisan? <em className="font-serif font-normal">Don&rsquo;t.</em>
          </SplitHeading>
          <Reveal className="mt-10 grid gap-8 md:grid-cols-12" delay={0.15}>
            <p className="text-lg leading-relaxed text-muted md:col-span-5">
              Money paid off the app has no escrow behind it. If the job goes wrong, we can&rsquo;t freeze it, refund
              it or get it back.
            </p>
            <p className="text-lg leading-relaxed text-muted md:col-span-5 md:col-start-8">
              Asking a client to pay directly breaks our rules. Messages that look like a request for off-app payment
              are flagged, and artisans who do it are suspended.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 04 — Reporting */}
      <section className="container-x pb-24 md:pb-36">
        <SectionHead
          index="04"
          label="Reporting"
          title={
            <>
              Something felt off? <em className="font-serif font-normal">Tell</em> us.
            </>
          }
        />
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <div className="space-y-5 text-lg leading-relaxed text-muted md:col-span-5">
            <p>
              Use <span className="text-fg">Report</span> on the artisan&rsquo;s profile or from your job. Pick a reason,
              add a short note, and send it.
            </p>
            <p>
              The artisan can respond. An admin reviews both sides and resolves it, which can mean a warning, a refund
              through escrow or a suspension.
            </p>
          </div>
          <Reveal as="ul" stagger={0.06} className="border-t border-border md:col-span-6 md:col-start-7">
            {REPORT_REASONS.map((r) => (
              <li key={r} data-reveal-item className="border-b border-border py-4 text-lg">
                {r}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 05 — Safeguarding */}
      <section className="container-x pb-24 md:pb-36">
        <SectionHead index="05" label="Safeguarding" title="Some work we don't list at all." />
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <p className="max-w-md text-lg leading-relaxed text-muted md:col-span-5">
            To protect children, Servhive does not list any trade that involves unsupervised care of minors.
            Applications in these categories are refused.
          </p>
          <Reveal as="ul" stagger={0.06} className="border-t border-border md:col-span-6 md:col-start-7">
            {BLOCKED_CATEGORIES.map((c) => (
              <li key={c.id} data-reveal-item className="flex items-baseline justify-between gap-4 border-b border-border py-4">
                <span className="text-lg">{c.name}</span>
                <span className="eyebrow">Not listed</span>
              </li>
            ))}
          </Reveal>
        </div>
        <p className="mt-16 text-sm text-muted">
          Questions about safety? Read the{" "}
          <Link href="/legal/protection" className="text-fg underline underline-offset-4">
            hirer protection terms
          </Link>{" "}
          or the{" "}
          <Link href="/legal/privacy" className="text-fg underline underline-offset-4">
            privacy policy
          </Link>
          .
        </p>
      </section>
    </>
  );
}
