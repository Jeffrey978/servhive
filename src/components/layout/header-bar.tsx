"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountButton } from "@/components/layout/account-button";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "./logo";
import { MAIN_NAV } from "./nav";
import { ThemeToggle } from "./theme-toggle";

type Session = { name: string; dashboardHref: string; role: string } | null;

/** Routes whose first section is a full-bleed photo: header starts transparent with white text. */
const OVER_PHOTO = new Set(["/", "/for-pros"]);

/**
 * Single-line nav (correction #4: never wraps). Animated states:
 *  - top of a photo hero: transparent, white ink
 *  - scrolled: solid surface pill with hairline border
 *  - scrolling down past 400px: slides away; scrolling up: returns
 * Active link gets a sliding underline; mobile opens a full-screen sheet with staggered links.
 */
export function HeaderBar({ session }: { session: Session }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Menu is "open for this path": navigating anywhere closes it without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const sheet = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);

  const overPhoto = OVER_PHOTO.has(pathname) && !scrolled && !open;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 400 && y > last + 2) setHidden(true);
      else if (y < last - 2 || y <= 400) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Intro: bar drops in once on first load.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(bar.current, { yPercent: -120, opacity: 0, duration: 1.2, delay: 0.15 });
    },
    { scope: bar },
  );

  useGSAP(
    () => {
      if (!open || !sheet.current) return;
      gsap.fromTo(
        sheet.current.querySelectorAll("[data-sheet-item]"),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.9, delay: 0.1 },
      );
    },
    { dependencies: [open] },
  );

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div className="container-x pt-3">
          <div
            className={cn(
              "flex h-14 items-center gap-6 rounded-full pl-5 pr-2 transition-[background-color,border-color,color,box-shadow] duration-500 ease-out-expo",
              overPhoto
                ? "border border-transparent bg-transparent text-white"
                : "border border-border bg-surface/85 text-fg backdrop-blur-xl",
            )}
          >
            <Logo className="shrink-0" />

            <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Main">
              <ul className="flex items-center gap-1 whitespace-nowrap">
                {MAIN_NAV.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group relative inline-flex h-10 items-center px-3.5 text-[0.9375rem] tracking-[-0.01em]"
                    >
                      <span className="relative overflow-hidden">
                        <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                          {l.label}
                        </span>
                        <span aria-hidden className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                          {l.label}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "absolute inset-x-3.5 bottom-1.5 h-px origin-left bg-current transition-transform duration-500 ease-out-expo",
                          isActive(l.href) ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0">
              <ThemeToggle />
              {session ? (
                <>
                  <Link
                    href={session.dashboardHref}
                    className={cn(
                      buttonVariants({ variant: overPhoto ? "light" : "primary", size: "sm" }),
                      "hidden sm:inline-flex",
                    )}
                  >
                    Dashboard
                  </Link>
                  <span className="ml-1 flex items-center">
                    <AccountButton />
                  </span>
                </>
              ) : (
                <>
                  <Link href="/sign-in" className="hidden h-10 items-center px-3 text-[0.9375rem] sm:inline-flex">
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className={cn(buttonVariants({ variant: "accent", size: "sm" }), "hidden sm:inline-flex")}
                  >
                    Get started
                    <ArrowUpRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </>
              )}
              <button
                type="button"
                onClick={() => setOpenAt(open ? null : pathname)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="inline-flex size-10 items-center justify-center rounded-full lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div ref={sheet} className="fixed inset-0 z-40 flex flex-col bg-bg pt-24 lg:hidden" data-lenis-prevent>
          <nav className="container-x flex-1" aria-label="Mobile">
            <ul className="space-y-1">
              {MAIN_NAV.map((l) => (
                <li key={l.href} className="overflow-hidden">
                  <Link
                    data-sheet-item
                    href={l.href}
                    className="flex items-baseline justify-between border-b border-border py-4 text-h2 font-medium"
                  >
                    {l.label}
                    <ArrowUpRight className="size-6 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="container-x flex gap-3 pb-10">
            {session ? (
              <Link href={session.dashboardHref} className={cn(buttonVariants({ size: "lg" }), "flex-1")}>
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href="/sign-in" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}>
                  Sign in
                </Link>
                <Link href="/sign-up" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "flex-1")}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
