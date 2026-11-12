import Link from "next/link";
import type { ReactNode } from "react";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Editorial section opener: numbered mono label on the left, big headline on the right,
 * optional aside (link or short note) aligned to the baseline.
 */
export function SectionHead({
  index,
  label,
  title,
  aside,
  className,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 border-t border-border pt-6 md:grid-cols-12 md:gap-8", className)}>
      <p className="eyebrow md:col-span-3">
        {index ? <span className="mr-3 text-fg">{index}</span> : null}
        {label}
      </p>
      <div className="md:col-span-9 md:flex md:items-end md:justify-between md:gap-10">
        <SplitHeading className="max-w-[18ch] text-h1 font-medium">{title}</SplitHeading>
        {aside ? (
          <Reveal className="mt-6 shrink-0 md:mt-0" delay={0.2}>
            {aside}
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

/** Underlined text link with a nudge arrow, used for section asides. */
export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 border-b border-current pb-1 text-[0.9375rem] font-medium",
        className,
      )}
    >
      {children}
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="size-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M5 11 11 5M6 5h5v5" />
      </svg>
    </Link>
  );
}
