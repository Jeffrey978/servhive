import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ChecklistItem } from "@/server/pro";
import { cn } from "@/lib/utils";

/** Numbered verification checklist with hairline rules. */
export function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <ol className="divide-y divide-border border-y border-border">
      {items.map((i, n) => (
        <li key={i.key}>
          <Link href={i.href} className="group flex items-center gap-4 py-3.5">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                i.done ? "border-success bg-success-soft text-success" : "border-border-strong text-muted",
              )}
            >
              {i.done ? <Check className="size-3.5" /> : n + 1}
            </span>
            <span className={cn("flex-1 text-[0.9375rem]", i.done && "text-muted line-through decoration-border-strong")}>
              {i.label}
              {!i.required ? <span className="ml-2 text-xs text-muted no-underline">(before first payout)</span> : null}
            </span>
            {i.meta ? <span className="font-mono text-xs text-muted">{i.meta}</span> : null}
            <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
