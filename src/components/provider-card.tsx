import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { Stars } from "@/components/ui/misc";
import { formatNaira, cn } from "@/lib/utils";

export type ProviderCardProps = {
  slug: string;
  businessName: string;
  area: string;
  imageUrl: string | null;
  startingPrice: number;
  ratingAvg: number;
  reviewCount: number;
  category: { name: string };
  boosted?: boolean;
  distanceKm?: number | null;
};

/**
 * Photo-forward artisan card. Deliberately sparse (correction #2: too much text in cards):
 * photo, name, trade · area, rating, starting price. Everything else lives on the profile.
 */
export function ProviderCard({
  p,
  className,
  sizes = "(min-width:1280px) 25vw, (min-width:768px) 33vw, 90vw",
  priority,
}: {
  p: ProviderCardProps;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Link href={`/artisans/${p.slug}`} className={cn("group block", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-surface-2">
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.businessName}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.06]"
          />
        ) : null}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          {p.boosted ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-accent-fg">
              Featured
            </span>
          ) : (
            <span />
          )}
          <span className="flex size-9 translate-y-1 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out-expo group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
        {p.distanceKm != null ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white backdrop-blur-md">
            {p.distanceKm < 1 ? "<1" : p.distanceKm.toFixed(1)} km away
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 truncate text-[1.0625rem] font-medium tracking-tight">
            <span className="truncate">{p.businessName}</span>
            <BadgeCheck className="size-4 shrink-0 text-accent" aria-label="ID-verified" />
          </h3>
          <p className="mt-1 truncate text-sm text-muted">
            {p.category.name} · {p.area}
          </p>
        </div>
        <Stars value={p.ratingAvg} className="shrink-0 pt-0.5" />
      </div>
      <p className="mt-2 text-sm">
        <span className="text-muted">From </span>
        <span className="font-medium">{formatNaira(p.startingPrice)}</span>
      </p>
    </Link>
  );
}
