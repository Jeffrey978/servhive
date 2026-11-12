import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SplitHeading } from "@/components/motion/split-heading";

/** Split-screen auth chrome: editorial photo left, form right. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-black text-white lg:block">
        <Image src="/assets/hero_tradesman.jpg" alt="" fill priority sizes="50vw" className="object-cover opacity-80" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo className="text-white" />
          <div>
            <SplitHeading as="p" trigger="load" className="max-w-lg text-h1 font-medium">
              Good work, <em className="font-serif font-normal">guaranteed</em> by escrow.
            </SplitHeading>
            <p className="mt-6 max-w-md text-white/75">
              Every artisan is ID-verified. Your money stays protected until you confirm the job is done.
            </p>
          </div>
        </div>
      </aside>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 lg:justify-end">
          <Logo className="lg:hidden" />
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-muted transition-colors hover:text-fg">
              Back to site
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-4">
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
