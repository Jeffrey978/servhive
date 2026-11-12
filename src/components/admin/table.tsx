import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Card } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

/**
 * Hairline data table that collapses to stacked rows under md.
 * A <Td label="…"> renders its label as a left-hand caption on mobile;
 * a <Td> without a label spans the row (use it for the title cell).
 */
export function Table({ head, children, className }: { head: ReactNode[]; children: ReactNode; className?: string }) {
  return (
    <div className={cn("md:overflow-x-auto md:rounded-card md:border md:border-border md:bg-surface", className)} data-lenis-prevent>
      <table className="block w-full border-collapse text-sm md:table">
        <thead className="hidden md:table-header-group">
          <tr className="border-b border-border">
            {head.map((h, i) => (
              <th key={i} scope="col" className="eyebrow whitespace-nowrap px-4 py-3 text-left font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="block border-t border-border md:table-row-group md:border-0">{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ className, ...props }: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className={cn(
        "block border-b border-border py-4 md:table-row md:py-0 md:transition-colors md:last:border-b-0 md:hover:bg-surface-2/50",
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  label,
  className,
  align,
  children,
}: {
  label?: string;
  className?: string;
  align?: "right";
  children: ReactNode;
}) {
  return (
    <td
      data-label={label}
      className={cn(
        "block py-1 md:table-cell md:px-4 md:py-3.5 md:align-middle",
        label &&
          "flex items-baseline justify-between gap-4 text-right before:shrink-0 before:font-mono before:text-[0.6875rem] before:uppercase before:tracking-[0.14em] before:text-muted before:text-left before:content-[attr(data-label)] md:text-left md:before:content-none",
        align === "right" && "md:text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

/** Pill tabs driven by a searchParam (server-rendered links). */
export function FilterTabs({
  items,
  active,
  className,
}: {
  items: { label: string; href: string; value: string; count?: number; highlight?: boolean }[];
  active: string;
  className?: string;
}) {
  return (
    <nav className={cn("no-scrollbar -mx-4 mb-6 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0", className)} aria-label="Filter">
      {items.map((i) => {
        const on = i.value === active;
        return (
          <Link
            key={i.value}
            href={i.href}
            aria-current={on ? "page" : undefined}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors",
              on ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-border-strong hover:text-fg",
            )}
          >
            {i.label}
            {i.count !== undefined ? (
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  i.highlight && i.count > 0 ? "rounded-full bg-accent px-1.5 text-accent-fg" : "opacity-70",
                )}
              >
                {i.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Pager({ page, total, pageSize, hrefFor }: { page: number; total: number; pageSize: number; hrefFor: (p: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const link = "inline-flex h-9 items-center rounded-full border border-border px-4 text-sm transition-colors hover:border-fg";
  return (
    <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted">
      <span className="font-mono text-xs">
        Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link href={hrefFor(page - 1)} className={link}>
            Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={hrefFor(page + 1)} className={link}>
            Next
          </Link>
        ) : null}
      </div>
    </div>
  );
}

/** Sparse KPI tile: label, number, one meta line. `highlight` is reserved for the pending-approvals count. */
export function Kpi({ label, value, hint, href, highlight }: { label: string; value: ReactNode; hint?: ReactNode; href?: string; highlight?: boolean }) {
  const body = (
    <Card className={cn("h-full p-5 transition-colors", highlight && "border-accent bg-accent-soft", href && "hover:border-border-strong")}>
      <p className="eyebrow flex items-center gap-2">
        {highlight ? <span className="size-1.5 rounded-full bg-accent" aria-hidden /> : null}
        {label}
      </p>
      <p className="mt-3 text-3xl font-medium tracking-tight tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </Card>
  );
  return href ? (
    <Link href={href} className="block">
      {body}
    </Link>
  ) : (
    body
  );
}

/** Build a URL keeping the current filters, dropping empty values. */
export function withParams(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || (k === "page" && Number(v) <= 1)) continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `${base}?${s}` : base;
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg">
      <span aria-hidden>←</span> {children}
    </Link>
  );
}
