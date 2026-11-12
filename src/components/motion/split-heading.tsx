"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Masked line-by-line headline reveal (the editorial "rise from below" effect).
 * Pass plain text or inline nodes (e.g. an <em> for the serif accent word).
 */
export function SplitHeading({
  as = "h2",
  children,
  className,
  delay = 0,
  trigger = "scroll",
  stagger = 0.09,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  trigger?: "scroll" | "load";
  stagger?: number;
}) {
  const Tag = as;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.set(el, { opacity: 1 });
      if (prefersReducedMotion()) return;
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.25,
              ease: "expo.out",
              stagger,
              delay,
              scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 90%", once: true } : undefined,
            });
          },
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
