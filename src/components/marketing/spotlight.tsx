import { ProviderCard } from "@/components/provider-card";
import { Reveal } from "@/components/motion/reveal";
import type { ProviderCardData } from "@/server/providers";
import { cn } from "@/lib/utils";

/**
 * Spotlight artisans. Mobile: horizontal snap rail. Desktop: staggered 4-up grid
 * (alternate columns drop down for an editorial rhythm).
 */
export function Spotlight({ providers }: { providers: (ProviderCardData & { boosted: boolean })[] }) {
  return (
    <Reveal
      stagger={0.08}
      className="no-scrollbar -mx-[clamp(1rem,3vw,2.5rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[clamp(1rem,3vw,2.5rem)] pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-x-6 md:gap-y-14 md:overflow-visible md:px-0 lg:grid-cols-4"
    >
      {providers.map((p, i) => (
        <div
          key={p.id}
          data-reveal-item
          className={cn("w-[72vw] max-w-xs shrink-0 snap-start md:w-auto md:max-w-none", i % 2 === 1 && "lg:mt-20")}
        >
          <ProviderCard
            p={{
              slug: p.slug,
              businessName: p.businessName,
              area: p.area,
              imageUrl: p.imageUrl,
              startingPrice: p.startingPrice,
              ratingAvg: p.ratingAvg,
              reviewCount: p.reviewCount,
              category: p.category,
              boosted: p.boosted,
            }}
          />
        </div>
      ))}
    </Reveal>
  );
}
