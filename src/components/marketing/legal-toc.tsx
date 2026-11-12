"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Sticky contents list with a scroll-spy marker on the section being read. */
export function LegalToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="eyebrow mb-5">On this page</p>
      <ol className="space-y-1 border-l border-border">
        {items.map((it, i) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={active === it.id ? "location" : undefined}
              className={cn(
                "-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors duration-300",
                active === it.id ? "border-fg text-fg" : "border-transparent text-muted hover:text-fg",
              )}
            >
              <span className="font-mono text-xs leading-5">{String(i + 1).padStart(2, "0")}</span>
              <span>{it.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
