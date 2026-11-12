"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Counts from 0 to `value` when scrolled into view. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) =>
    prefix + n.toLocaleString("en-NG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;
      const obj = { n: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        n: value,
        duration: 1.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate: () => {
          el.textContent = fmt(obj.n);
        },
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className}>
      {fmt(value)}
    </span>
  );
}
