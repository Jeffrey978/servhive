import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { RULES, CITY } from "@/lib/constants";
import { HeroBackdrop } from "./hero-backdrop";
import { HeroSearch } from "./hero-search";

/** Full-viewport photo hero. Starts at y=0: the header sits transparent over it. */
export function LandingHero({ categories }: { categories: { id: string; name: string }[] }) {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden text-white">
      <HeroBackdrop src="/assets/hero_tradesman.jpg" alt="An artisan at work on a site in Port Harcourt" />

      <div className="container-x relative flex flex-1 flex-col pb-8 pt-28 md:pb-10 md:pt-32">
        <Reveal trigger="load" delay={0.5} className="flex items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/75">
          <span>{CITY}, Rivers State</span>
          <span className="hidden sm:inline">Verified artisans · Escrow payments</span>
        </Reveal>

        <div className="mt-auto pt-16">
          <SplitHeading as="h1" trigger="load" delay={0.25} className="max-w-[14ch] text-display font-medium">
            Skilled hands. <em className="font-serif font-normal">Safe</em> payments.
          </SplitHeading>

          <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-12 lg:items-end">
            <Reveal trigger="load" delay={0.7} className="lg:col-span-4">
              <p className="max-w-sm text-base leading-relaxed text-white/85 md:text-lg">
                Hire ID-verified artisans across {CITY}. Your money waits in escrow until the job is done.
              </p>
            </Reveal>
            <Reveal trigger="load" delay={0.85} className="lg:col-span-8 lg:flex lg:justify-end">
              <HeroSearch categories={categories} />
            </Reveal>
          </div>

          <Reveal
            trigger="load"
            delay={1}
            as="ul"
            className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/20 pt-5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-white/75"
          >
            <li>ID-verified</li>
            <li aria-hidden>·</li>
            <li>Escrow-protected</li>
            <li aria-hidden>·</li>
            <li>{RULES.autoReleaseHours}h release</li>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
