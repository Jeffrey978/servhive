import type { Metadata } from "next";
import { LandingHero } from "@/components/marketing/landing-hero";
import { AreaMarquee } from "@/components/marketing/area-marquee";
import { SectionHead, ArrowLink } from "@/components/marketing/section-head";
import { TradeIndex } from "@/components/marketing/trade-index";
import { Spotlight } from "@/components/marketing/spotlight";
import { EscrowSequence } from "@/components/marketing/escrow-sequence";
import { StatsBand } from "@/components/marketing/stats-band";
import { PullQuote } from "@/components/marketing/pull-quote";
import { ProCta } from "@/components/marketing/pro-cta";
import { getCategories, getFeaturedReview, getSpotlight, getStats } from "@/components/marketing/data";
import { CITY } from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: "Servhive — Verified artisans in Port Harcourt, paid through escrow" },
  description: `Hire ID-verified electricians, solar installers, stylists, plumbers and more across ${CITY}. Your payment stays in escrow until the job is done.`,
};

export default async function Home() {
  const [spotlight, categories, stats, review] = await Promise.all([
    getSpotlight(8),
    getCategories(),
    getStats(),
    getFeaturedReview(),
  ]);

  // Regulated trades have no public starting rate; keep the index to everyday trades.
  const trades = categories.filter((c) => !c.requiresLicence).slice(0, 10);

  let section = 0;
  const nextIndex = () => String(++section).padStart(2, "0");

  return (
    <>
      <LandingHero categories={categories.map((c) => ({ id: c.id, name: c.name }))} />

      <AreaMarquee />

      {trades.length > 0 ? (
        <section className="container-x pt-24 md:pt-36">
          <SectionHead
            index={nextIndex()}
            label="Trades"
            title={
              <>
                Whatever broke, <em className="font-serif font-normal">someone</em> here fixes it.
              </>
            }
            aside={<ArrowLink href="/categories">All {categories.length} trades</ArrowLink>}
          />
          <div className="mt-12 md:mt-20">
            <TradeIndex
              rows={trades.map((c) => ({ id: c.id, name: c.name, rateFrom: c.rateFrom, pros: c.pros, imageUrl: c.imageUrl }))}
            />
          </div>
        </section>
      ) : null}

      {spotlight.length > 0 ? (
        <section className="container-x pt-24 md:pt-36">
          <SectionHead
            index={nextIndex()}
            label="Spotlight"
            title={
              <>
                Pros people <em className="font-serif font-normal">keep</em> calling back.
              </>
            }
            aside={<ArrowLink href="/artisans">Browse all artisans</ArrowLink>}
          />
          <div className="mt-12 md:mt-20">
            <Spotlight providers={spotlight} />
          </div>
        </section>
      ) : null}

      <section className="container-x pt-24 md:pt-36">
        <SectionHead
          index={nextIndex()}
          label="How escrow works"
          title={
            <>
              Your money waits. <em className="font-serif font-normal">Then</em> it moves.
            </>
          }
          aside={<ArrowLink href="/how-it-works">The full process</ArrowLink>}
        />
        <div className="mt-12 md:mt-20">
          <EscrowSequence />
        </div>
      </section>

      {stats && stats.artisans > 0 ? (
        <section className="container-x pt-24 md:pt-36">
          <StatsBand stats={stats} />
        </section>
      ) : null}

      <section className="container-x py-24 md:py-40">
        <PullQuote review={review} />
      </section>

      <section className="container-x border-t border-border py-24 md:py-36">
        <ProCta />
      </section>
    </>
  );
}
