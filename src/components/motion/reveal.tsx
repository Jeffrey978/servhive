"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type RevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  /** Vertical travel in px. */
  y?: number;
  delay?: number;
  /** If set, animates direct children marked `data-reveal-item` with this stagger instead of the wrapper. */
  stagger?: number;
  /** "scroll" (default) waits for the element to enter the viewport; "load" plays immediately. */
  trigger?: "scroll" | "load";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Fade-and-rise on enter. Hidden via `.js-motion [data-reveal]` before hydration
 * (no flash), and always visible when reduced motion is on.
 */
export function Reveal<T extends ElementType = "div">({
  as,
  children,
  y = 36,
  delay = 0,
  stagger,
  trigger = "scroll",
  className,
  ...rest
}: RevealProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      const items = stagger ? el.querySelectorAll<HTMLElement>("[data-reveal-item]") : null;
      const targets = items && items.length ? items : el;
      if (items && items.length) gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          delay,
          stagger: stagger ?? 0,
          duration: 1.1,
          ease: "expo.out",
          clearProps: "transform",
          scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}
