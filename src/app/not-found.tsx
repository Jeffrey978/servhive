import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Rendered inside the root layout only (no site header/footer), so it carries its own logo. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col bg-bg text-fg">
      <div className="container-x flex h-20 items-center">
        <Logo />
      </div>
      <div className="container-x flex flex-1 flex-col justify-center py-16">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 text-display font-medium">
          Nothing <em className="font-serif font-normal">here</em>.
        </h1>
        <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-12">
          <p className="max-w-md text-lg leading-relaxed text-muted md:col-span-6">
            The page moved, or the link was mistyped. The artisans are all still where you left them.
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Link href="/" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Back to home
            </Link>
            <Link href="/artisans" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Find an artisan
              <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
      <div className="container-x pb-8">
        <p className="overflow-hidden text-[clamp(6rem,30vw,26rem)] font-semibold leading-[0.75] tracking-[-0.07em] text-surface-2 select-none" aria-hidden>
          404
        </p>
      </div>
    </main>
  );
}
