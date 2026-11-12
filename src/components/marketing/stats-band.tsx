import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { MarketplaceStats } from "./data";

/** Big numbers on the page background, split by hairlines. Hidden when the marketplace is empty. */
export function StatsBand({ stats }: { stats: MarketplaceStats | null }) {
  if (!stats || stats.artisans === 0) return null;
  const items = [
    { label: "Verified artisans", value: stats.artisans, decimals: 0 },
    { label: "Trades covered", value: stats.categories, decimals: 0 },
    { label: "Jobs completed", value: stats.jobsCompleted, decimals: 0 },
    { label: "Average rating", value: stats.avgRating, decimals: 1, suffix: "/5" },
  ].filter((s) => s.value > 0);

  return (
    <Reveal stagger={0.1} as="dl" className="grid grid-cols-2 border-t border-border lg:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          data-reveal-item
          className={cn(
            "flex flex-col-reverse gap-3 border-b border-border py-8 lg:border-b-0 lg:py-12",
            i % 2 === 1 ? "border-l pl-5 md:pl-8" : "pr-5 md:pr-8",
            i > 0 && "lg:border-l lg:pl-8",
          )}
        >
          <dt className="eyebrow">{s.label}</dt>
          <dd className="text-[clamp(2.75rem,7vw,6.5rem)] font-medium leading-none tracking-[-0.05em]">
            <CountUp value={s.value} decimals={s.decimals} />
            {s.suffix ? <span className="text-muted text-[0.4em] tracking-tight">{s.suffix}</span> : null}
          </dd>
        </div>
      ))}
    </Reveal>
  );
}
