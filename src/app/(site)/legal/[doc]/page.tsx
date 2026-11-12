import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, LEGAL_SLUGS, isLegalSlug } from "@/components/marketing/legal-content";
import { LegalToc } from "@/components/marketing/legal-toc";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeading } from "@/components/motion/split-heading";
import { cn, formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return LEGAL_SLUGS.map((doc) => ({ doc }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  if (!isLegalSlug(doc)) return { title: "Not found" };
  const d = LEGAL_DOCS[doc];
  return { title: d.title, description: d.summary };
}

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  if (!isLegalSlug(doc)) notFound();
  const d = LEGAL_DOCS[doc];

  return (
    <article className="container-x pb-24 pt-36 md:pb-36 md:pt-48">
      <header>
        <nav aria-label="Legal documents" className="no-scrollbar -mx-[clamp(1rem,3vw,2.5rem)] overflow-x-auto px-[clamp(1rem,3vw,2.5rem)]">
          <ul className="flex gap-2 whitespace-nowrap">
            {LEGAL_SLUGS.map((s) => (
              <li key={s}>
                <Link
                  href={`/legal/${s}`}
                  aria-current={s === doc ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors duration-300",
                    s === doc ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-fg hover:text-fg",
                  )}
                >
                  {LEGAL_DOCS[s].short}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <SplitHeading as="h1" trigger="load" className="mt-10 max-w-[16ch] text-h1 font-medium">
          {d.title}
        </SplitHeading>
        <Reveal
          trigger="load"
          delay={0.3}
          className="mt-8 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-baseline md:justify-between"
        >
          <p className="max-w-xl text-lg text-muted">{d.summary}</p>
          <p className="eyebrow shrink-0">Updated {formatDate(d.updated)}</p>
        </Reveal>
      </header>

      <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-8">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <LegalToc items={d.sections.map((s) => ({ id: s.id, label: s.heading }))} />
          </div>
        </aside>

        <div className="lg:col-span-7 lg:col-start-5">
          {d.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0">
              <p className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 text-h3 font-medium">{s.heading}</h2>
              <div className="mt-5 space-y-4 text-[1.0625rem] leading-[1.75] text-fg/85">
                {s.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </section>
          ))}

          <p className="mt-6 border-t border-border pt-8 text-sm text-muted">
            For the practical side of these terms, see how we keep{" "}
            <Link href="/safety" className="text-fg underline underline-offset-4">
              hiring safe
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
