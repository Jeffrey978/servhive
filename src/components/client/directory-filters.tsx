"use client";

import {
  useId,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LocateFixed, Loader2, Search, X } from "lucide-react";
import { Select } from "@/components/ui/field";
import { CITY, CITY_CENTER, LANDMARKS, MAX_RADIUS_KM } from "@/lib/constants";
import { cn, distanceKm } from "@/lib/utils";

export type DirectoryParams = {
  q: string;
  category: string;
  area: string;
  minRating: string;
  maxPrice: string;
  sort: string;
  near: string;
  landmark: string;
};

/**
 * Owns the URL-driven filter state for /artisans. Filters live in searchParams; every change
 * is a router.replace inside a transition so results dim while the server re-renders.
 */
export function DirectoryExplorer({
  params,
  categories,
  areas,
  children,
}: {
  params: DirectoryParams;
  categories: { id: string; name: string; count: number }[];
  areas: readonly string[];
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();
  // Controls reflect the new choice immediately while the server re-renders the results.
  const [current, setCurrent] = useOptimistic(params);

  function update(patch: Partial<DirectoryParams>) {
    const next: DirectoryParams = { ...current, ...patch };
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) {
      if (!v) continue;
      if (k === "category" && v === "all") continue;
      if (k === "sort" && v === "featured") continue;
      sp.set(k, v);
    }
    const qs = sp.toString();
    start(() => {
      setCurrent(next);
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  }

  return (
    <>
      <FilterBar
        params={current}
        categories={categories}
        areas={areas}
        update={update}
        pending={pending}
      />
      <div
        aria-busy={pending}
        className={cn(
          "transition-opacity duration-300",
          pending && "opacity-50",
        )}
      >
        {children}
      </div>
    </>
  );
}

const RATINGS = [
  ["", "Any rating"],
  ["4.5", "4.5 and up"],
  ["4", "4.0 and up"],
  ["3.5", "3.5 and up"],
] as const;

const PRICES = [
  ["", "Any price"],
  ["10000", "From ₦10,000 or less"],
  ["20000", "From ₦20,000 or less"],
  ["50000", "From ₦50,000 or less"],
  ["100000", "From ₦100,000 or less"],
] as const;

const SORTS = [
  ["featured", "Featured"],
  ["distance", "Nearest"],
  ["rating", "Top rated"],
  ["reviews", "Most reviewed"],
  ["price", "Lowest price"],
] as const;

function FilterBar({
  params,
  categories,
  areas,
  update,
  pending,
}: {
  params: DirectoryParams;
  categories: { id: string; name: string; count: number }[];
  areas: readonly string[];
  update: (patch: Partial<DirectoryParams>) => void;
  pending: boolean;
}) {
  const [q, setQ] = useState(params.q);
  const [geo, setGeo] = useState<"idle" | "locating" | "far" | "denied">(
    "idle",
  );
  const landmarkId = useId();
  const debounce = useRef<number | undefined>(undefined);
  const activeCategory = params.category || "all";
  const usingLocation = !!params.near;

  const focusLandmark = () => document.getElementById(landmarkId)?.focus();

  /** Debounced search → URL. */
  function search(value: string, immediate = false) {
    setQ(value);
    window.clearTimeout(debounce.current);
    if (immediate) update({ q: value.trim() });
    else
      debounce.current = window.setTimeout(
        () => update({ q: value.trim() }),
        350,
      );
  }

  function nearMe() {
    if (!("geolocation" in navigator)) {
      setGeo("denied");
      focusLandmark();
      return;
    }
    setGeo("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (distanceKm(here, CITY_CENTER) > MAX_RADIUS_KM) {
          setGeo("far");
          focusLandmark();
          return;
        }
        setGeo("idle");
        update({
          near: `${here.lat.toFixed(4)},${here.lng.toFixed(4)}`,
          landmark: "",
          sort: "distance",
        });
      },
      () => {
        setGeo("denied");
        focusLandmark();
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }

  const hasFilters = !!(
    params.q ||
    params.area ||
    params.minRating ||
    params.maxPrice ||
    params.near ||
    params.landmark ||
    (params.category && params.category !== "all")
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search artisans</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => search(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                search(q, true);
              }
            }}
            placeholder="Generator repair, braids, tiling…"
            className="h-12 w-full rounded-full border border-border bg-surface pl-11 pr-11 text-[0.9375rem] placeholder:text-muted/70 transition-colors hover:border-border-strong focus:border-fg focus:outline-none"
          />
          {pending ? (
            <Loader2
              aria-label="Loading results"
              className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted"
            />
          ) : null}
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={nearMe}
            disabled={geo === "locating"}
            aria-pressed={usingLocation}
            className={cn(
              "inline-flex h-12 shrink-0 items-center gap-2 rounded-full border px-5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60",
              usingLocation
                ? "border-fg bg-fg text-bg"
                : "border-border-strong hover:border-fg",
            )}
          >
            {geo === "locating" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LocateFixed className="size-4" />
            )}
            {geo === "locating" ? "Locating…" : "Near me"}
          </button>
          <label className="min-w-0 flex-1 md:w-56 md:flex-none">
            <span className="sr-only">Near a landmark</span>
            <Select
              id={landmarkId}
              value={params.landmark}
              onChange={(e) => {
                setGeo("idle");
                const v = e.target.value;
                update({
                  landmark: v,
                  near: "",
                  sort: v
                    ? "distance"
                    : params.sort === "distance"
                      ? ""
                      : params.sort,
                });
              }}
              className="rounded-full"
            >
              <option value="">Near a landmark…</option>
              {LANDMARKS.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.shortName}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </div>

      {geo === "far" || geo === "denied" ? (
        <p role="status" className="text-sm text-muted">
          {geo === "far"
            ? `You look to be outside ${CITY}. Pick a landmark to sort by distance instead.`
            : "We couldn't get your location. Pick a landmark to sort by distance instead."}
        </p>
      ) : null}

      <div
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0"
        role="group"
        aria-label="Category"
      >
        {[{ id: "all", name: "All trades", count: -1 }, ...categories].map(
          (c) => {
            const on = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => update({ category: c.id })}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors",
                  on
                    ? "border-fg bg-fg text-bg"
                    : "border-border text-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {c.name}
                {c.count >= 0 ? (
                  <span
                    className={cn(
                      "text-xs",
                      on ? "text-bg/60" : "text-muted/70",
                    )}
                  >
                    {c.count}
                  </span>
                ) : null}
              </button>
            );
          },
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <label>
          <span className="sr-only">Area</span>
          <Select
            value={params.area}
            onChange={(e) => update({ area: e.target.value })}
            className="h-11 text-sm"
          >
            <option value="">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Minimum rating</span>
          <Select
            value={params.minRating}
            onChange={(e) => update({ minRating: e.target.value })}
            className="h-11 text-sm"
          >
            {RATINGS.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Maximum starting price</span>
          <Select
            value={params.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="h-11 text-sm"
          >
            {PRICES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </label>
        <label>
          <span className="sr-only">Sort by</span>
          <Select
            value={params.sort || "featured"}
            onChange={(e) => update({ sort: e.target.value })}
            className="h-11 text-sm"
          >
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>
                Sort: {l}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => {
            setQ("");
            window.clearTimeout(debounce.current);
            setGeo("idle");
            update({
              q: "",
              category: "",
              area: "",
              minRating: "",
              maxPrice: "",
              near: "",
              landmark: "",
              sort: "",
            });
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          <X className="size-3.5" /> Clear filters
        </button>
      ) : null}
    </div>
  );
}
