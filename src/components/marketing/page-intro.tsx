import type { ReactNode } from "react";
import { SplitHeading } from "@/components/motion/split-heading";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Opening block for interior marketing pages (solid header, so it clears the nav). */
export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-x pb-16 pt-36 md:pb-24 md:pt-48", className)}>
      <Reveal trigger="load" delay={0.2}>
        <p className="eyebrow">{eyebrow}</p>
      </Reveal>
      <SplitHeading as="h1" trigger="load" delay={0.1} className="mt-6 max-w-[16ch] text-display font-medium">
        {title}
      </SplitHeading>
      {lede || children ? (
        <Reveal
          trigger="load"
          delay={0.55}
          className="mt-10 grid gap-8 border-t border-border pt-8 md:mt-14 md:grid-cols-12"
        >
          {lede ? <p className="max-w-xl text-lg leading-relaxed text-muted md:col-span-7 md:text-xl">{lede}</p> : null}
          {children ? <div className="md:col-span-5 md:flex md:items-start md:justify-end">{children}</div> : null}
        </Reveal>
      ) : null}
    </header>
  );
}

/** Numbered editorial row: big index, title, body. Used for step and rule lists. */
export function NumberedRow({
  n,
  title,
  children,
  aside,
}: {
  n: number | string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <li data-reveal-item className="grid gap-4 border-t border-border py-8 md:grid-cols-12 md:gap-8 md:py-10">
      <span className="font-mono text-xs text-muted md:col-span-2 md:pt-2">
        {typeof n === "number" ? String(n).padStart(2, "0") : n}
      </span>
      <h3 className="text-h3 font-medium md:col-span-4">{title}</h3>
      <div className="max-w-xl text-base leading-relaxed text-muted md:col-span-5">{children}</div>
      {aside ? <div className="md:col-span-1 md:text-right">{aside}</div> : null}
    </li>
  );
}
