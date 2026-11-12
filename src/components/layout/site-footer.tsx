import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { CITY } from "@/lib/constants";
import { LogoMark } from "./logo";
import { FOOTER_NAV } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-bg">
      <div className="container-x pt-20 pb-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-sm text-h3 font-medium">
              Skilled hands across {CITY}, <em className="font-serif font-normal">paid safely.</em>
            </p>
            <Link
              href="/sign-up"
              className="group mt-8 inline-flex items-center gap-2 border-b border-fg pb-1 text-[0.9375rem] font-medium"
            >
              Create a free account
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
          {FOOTER_NAV.map((col) => (
            <div key={col.title} className="md:col-span-2 md:col-start-auto">
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.9375rem] text-fg/80 transition-colors hover:text-fg">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Reveal className="mt-20 flex items-end gap-4 overflow-hidden" y={80}>
          <LogoMark className="size-[clamp(3rem,10vw,9rem)] shrink-0" />
          <span className="text-[clamp(4rem,17vw,16rem)] font-semibold leading-[0.78] tracking-[-0.06em]">Servhive</span>
        </Reveal>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Servhive. Made in {CITY}.</p>
          <p>Payments held in escrow · Every pro ID-verified</p>
        </div>
      </div>
    </footer>
  );
}
