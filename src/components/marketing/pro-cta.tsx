import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { buttonVariants } from "@/components/ui/button";
import { RULES } from "@/lib/constants";
import { formatNaira } from "@/lib/utils";
import { PHOTOS } from "./photos";

/** Split photo + copy CTA for artisans. */
export function ProCta() {
  const terms = [
    { n: `${RULES.freeTrialMonths} months`, l: "free to start" },
    { n: `${RULES.commissionPct}%`, l: "only on completed jobs" },
    { n: formatNaira(RULES.monthlySubscription), l: "a month after the trial" },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
      <ParallaxImage
        src={PHOTOS.hair}
        alt="A hairstylist working in her Port Harcourt salon"
        className="aspect-[4/5] rounded-card bg-surface-2 sm:aspect-[5/4] lg:col-span-6 lg:aspect-[4/5]"
        sizes="(min-width:1024px) 50vw, 100vw"
      />
      <div className="lg:col-span-5 lg:col-start-8">
        <p className="eyebrow">For artisans</p>
        <SplitHeading className="mt-5 text-h1 font-medium">
          Get paid for the work, <em className="font-serif font-normal">not</em> the chase.
        </SplitHeading>
        <Reveal as="dl" stagger={0.08} className="mt-10 border-t border-border">
          {terms.map((t) => (
            <div key={t.l} data-reveal-item className="flex items-baseline justify-between gap-4 border-b border-border py-4">
              <dt className="text-muted">{t.l}</dt>
              <dd className="text-h3 font-medium">{t.n}</dd>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <Link href="/sign-up?as=pro" className={buttonVariants({ variant: "accent", size: "lg" })}>
              Join as a pro
              <ArrowUpRight />
            </Link>
          </Magnetic>
          <Link href="/for-pros" className={buttonVariants({ variant: "outline", size: "lg" })}>
            How it works for pros
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
