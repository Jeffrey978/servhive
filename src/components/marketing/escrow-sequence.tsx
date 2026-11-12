"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { StatusBadge } from "@/components/ui/badge";
import { cn, formatNaira } from "@/lib/utils";
import { RULES } from "@/lib/constants";
import { PHOTOS } from "./photos";

const JOB_AMOUNT = 85000;

const STEPS = [
  {
    title: "Ask for a quote",
    body: "Describe the job and your area. The artisan replies with a fixed price before anyone moves.",
    status: "QUOTED",
    photo: PHOTOS.tradesman,
  },
  {
    title: "Fund escrow",
    body: "You pay into escrow. The artisan can see the money is there, but nobody can touch it yet.",
    status: "FUNDED",
    photo: PHOTOS.solar,
  },
  {
    title: "The work gets done",
    body: "The artisan finishes and marks the job complete. You check it in person.",
    status: "AWAITING_RELEASE",
    photo: PHOTOS.interior,
  },
  {
    title: "Release payment",
    body: `Happy? Release it. Say nothing and it releases itself after ${RULES.autoReleaseHours} hours. Something wrong? Open a dispute instead.`,
    status: "RELEASED",
    photo: PHOTOS.hair,
  },
] as const;

/**
 * "How escrow works" — on large screens with motion allowed, the visual is pinned (CSS sticky)
 * while the steps scroll past; ScrollTrigger advances the active step and fills the progress rule.
 * Everywhere else it is a plain stacked list (layout is decided in CSS via `lg:motion-safe:`).
 */
export function EscrowSequence() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        steps.forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 55%", end: "bottom 55%", scrub: true },
          },
        );
        return () => setActive(0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const step = STEPS[active]!;

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      {/* Pinned visual */}
      <div className="hidden lg:col-span-6 lg:motion-safe:block">
        <div className="sticky top-24 h-[calc(100svh-8rem)] min-h-[32rem]">
          <div className="relative h-full overflow-hidden rounded-card bg-surface-2">
            {STEPS.map((s, i) => (
              <Image
                key={s.title}
                src={s.photo}
                alt=""
                fill
                sizes="50vw"
                className={cn(
                  "object-cover transition-[opacity,transform] duration-1000 ease-out-expo",
                  active === i ? "scale-100 opacity-100" : "scale-105 opacity-0",
                )}
              />
            ))}
            <div aria-hidden className="absolute inset-0 bg-black/25" />
            <span
              aria-hidden
              className="absolute left-6 top-4 font-mono text-[clamp(6rem,12vw,11rem)] font-medium leading-none tracking-[-0.06em] text-white"
            >
              {String(active + 1).padStart(2, "0")}
            </span>
            {/* Sparse job ticket: title, one meta line, one number. */}
            <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 rounded-card bg-surface p-5 text-fg">
              <div className="min-w-0">
                <p className="truncate font-medium">Your job</p>
                <p className="mt-1 text-sm text-muted">Fixed quote · Woji</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-2xl font-medium tracking-tight">{formatNaira(JOB_AMOUNT)}</p>
                <StatusBadge key={step.status} status={step.status} className="mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <ol data-steps className="relative lg:col-span-5 lg:col-start-8">
        <span aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-border lg:motion-safe:block">
          <span data-progress className="block h-full w-full origin-top bg-fg" />
        </span>
        {STEPS.map((s, i) => (
          <li
            key={s.title}
            data-step
            className={cn(
              "border-t border-border py-8 transition-opacity duration-700 ease-out-expo first:border-t-0 lg:motion-safe:flex lg:motion-safe:min-h-[70svh] lg:motion-safe:flex-col lg:motion-safe:justify-center lg:motion-safe:border-t-0 lg:motion-safe:pl-10",
              active !== i && "lg:motion-safe:opacity-30",
            )}
          >
            <p className="font-mono text-xs text-muted">Step {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-3 text-h2 font-medium">{s.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted md:text-lg">{s.body}</p>
            <StatusBadge status={s.status} className="mt-5 lg:motion-safe:hidden" />
          </li>
        ))}
      </ol>
    </div>
  );
}
