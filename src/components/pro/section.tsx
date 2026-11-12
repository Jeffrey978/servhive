import type { ReactNode } from "react";

/** Numbered, hairline-ruled settings section: label column + content column. */
export function ProSection({ n, title, id, aside, children }: { n: string; title: string; id?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border py-10 md:grid md:grid-cols-[10rem_1fr] md:gap-8">
      <div className="mb-6 md:mb-0">
        <p className="font-mono text-xs text-muted">{n}</p>
        <h2 className="mt-1 text-lg font-medium">{title}</h2>
        {aside ? <div className="mt-2">{aside}</div> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
