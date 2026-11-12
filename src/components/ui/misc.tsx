import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn, initials } from "@/lib/utils";

/** Flat surface card. No shadows/gradients — a hairline border does the work. */
export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("rounded-card border border-border bg-surface", className)} {...props} />;
}

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2 text-xs font-semibold text-fg",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {src ? <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" /> : initials(name)}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong px-6 py-16 text-center",
        className,
      )}
    >
      <p className="text-h3 font-medium">{title}</p>
      {body ? <p className="mt-2 max-w-sm text-sm text-muted">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

/** Section heading used inside dashboards. */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="text-h2 font-medium">{title}</h1>
        {description ? <p className="mt-3 max-w-xl text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

/** KPI tile. */
export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <Card className="p-5">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-3xl font-medium tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </Card>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)} aria-label={`${value.toFixed(1)} out of 5`}>
      <svg viewBox="0 0 20 20" className="size-3.5 fill-accent" aria-hidden>
        <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z" />
      </svg>
      <span className="font-medium">{value > 0 ? value.toFixed(1) : "New"}</span>
    </span>
  );
}
