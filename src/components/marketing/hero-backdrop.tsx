"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Full-bleed hero photo: settles from a slight zoom on load, then drifts slower
 * than the page while scrolling out. Flat scrim only (no gradients).
 */
export function HeroBackdrop({ src, alt, scrim = "bg-black/45" }: { src: string; alt: string; scrim?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !frame.current || !inner.current) return;
      gsap.fromTo(inner.current, { scale: 1.14 }, { scale: 1, duration: 2.4, ease: "expo.out" });
      gsap.to(inner.current, {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: frame.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className="absolute inset-0 overflow-hidden bg-black">
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <Image src={src} alt={alt} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div aria-hidden className={`absolute inset-0 ${scrim}`} />
    </div>
  );
}
