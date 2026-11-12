"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Image that drifts inside its frame while scrolling. The frame sets the size. */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  amount = 12,
  priority,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Max drift in percent of the frame height. */
  amount?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !frame.current || !inner.current) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0 -inset-y-[8%] will-change-transform">
        <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={cn("object-cover", imgClassName)} />
      </div>
    </div>
  );
}
