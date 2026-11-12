"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn, formatNaira } from "@/lib/utils";
import { fallbackPhoto } from "./photos";

export type TradeRow = { id: string; name: string; rateFrom: number; pros: number; imageUrl: string | null };

/**
 * Index of trades as big type rows. On fine pointers a photo follows the cursor and
 * swaps per hovered row; siblings dim. Touch / reduced motion: plain list with a thumbnail.
 */
export function TradeIndex({ rows }: { rows: TradeRow[] }) {
  const root = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  useGSAP(
    () => {
      const el = root.current;
      const f = float.current;
      if (!el || !f || prefersReducedMotion() || !window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches) return;
      setEnabled(true);
      gsap.set(f, { xPercent: -50, yPercent: -50, scale: 0.6, autoAlpha: 0 });
      const xTo = gsap.quickTo(f, "x", { duration: 0.7, ease: "power3.out" });
      const yTo = gsap.quickTo(f, "y", { duration: 0.7, ease: "power3.out" });
      const rTo = gsap.quickTo(f, "rotation", { duration: 0.9, ease: "power3.out" });
      let lastX = 0;
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        xTo(x);
        yTo(e.clientY - r.top);
        rTo(gsap.utils.clamp(-8, 8, (x - lastX) * 0.6));
        lastX = x;
      };
      const enter = () => gsap.to(f, { autoAlpha: 1, scale: 1, duration: 0.6, ease: "expo.out" });
      const leave = () => {
        gsap.to(f, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: "expo.out" });
        setActive(null);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <ul className="border-b border-border">
        {rows.map((r, i) => (
          <li
            key={r.id}
            onPointerEnter={() => setActive(i)}
            className={cn(
              "border-t border-border transition-opacity duration-500 ease-out-expo",
              enabled && active !== null && active !== i && "opacity-30",
            )}
          >
            <Link
              href={`/artisans?category=${encodeURIComponent(r.id)}`}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 md:gap-8 md:py-7"
            >
              <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-surface-2 lg:hidden">
                <Image src={r.imageUrl ?? fallbackPhoto(i)} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="hidden w-10 font-mono text-xs text-muted lg:block">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block truncate text-[1.375rem] font-medium leading-tight tracking-[-0.03em] transition-transform duration-700 ease-out-expo sm:text-h2 lg:group-hover:translate-x-4">
                  {r.name}
                </span>
                <span className="mt-1 block text-sm text-muted lg:hidden">
                  {r.rateFrom > 0 ? `From ${formatNaira(r.rateFrom)}` : "Quote on request"}
                </span>
              </span>
              <span className="flex items-center gap-6 md:gap-10">
                <span className="hidden text-right text-sm text-muted lg:block">
                  {r.rateFrom > 0 ? <>From {formatNaira(r.rateFrom)}</> : "Quote on request"}
                </span>
                <span className="hidden w-16 text-right font-mono text-xs text-muted sm:block">
                  {r.pros} {r.pros === 1 ? "pro" : "pros"}
                </span>
                <span className="flex size-10 items-center justify-center rounded-full border border-border transition-colors duration-500 ease-out-expo group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
                  <ArrowUpRight className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview (desktop, fine pointer only). */}
      <div
        ref={float}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-10 hidden aspect-[4/5] w-60 overflow-hidden rounded-card bg-surface-2 lg:block xl:w-72"
      >
        {rows.map((r, i) => (
          <Image
            key={r.id}
            src={r.imageUrl ?? fallbackPhoto(i)}
            alt=""
            fill
            sizes="288px"
            className={cn(
              "object-cover transition-[opacity,transform] duration-700 ease-out-expo",
              active === i ? "scale-100 opacity-100" : "scale-110 opacity-0",
            )}
          />
        ))}
      </div>
    </div>
  );
}
