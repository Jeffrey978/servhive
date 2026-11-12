"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

/** Accordion with hairline rows. One open at a time; height animates via grid rows (no JS measuring). */
export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <ul className="border-b border-border">
      {items.map((it, i) => {
        const isOpen = open === i;
        const panel = `${base}-panel-${i}`;
        const button = `${base}-btn-${i}`;
        return (
          <li key={it.q} className="border-t border-border">
            <h3>
              <button
                id={button}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="text-lg font-medium tracking-tight md:text-h3">{it.q}</span>
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-[transform,background-color,color,border-color] duration-500 ease-out-expo group-hover:border-fg",
                    isOpen && "rotate-45 border-fg bg-fg text-bg",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panel}
              role="region"
              aria-labelledby={button}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 pr-14 text-base leading-relaxed text-muted">{it.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
