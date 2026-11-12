import Link from "next/link";
import type { ReactNode } from "react";
import { AccountButton } from "@/components/layout/account-button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DashboardNav, type DashNavItem } from "./dashboard-nav";

/**
 * App chrome for /account, /pro and /admin. Desktop: fixed sidebar. Mobile: sticky top bar + scrollable pill tabs.
 * Usage (in a layout.tsx):
 *   <DashboardShell label="Pro portal" nav={[{ href: "/pro", label: "Overview", icon: "overview", exact: true }]} user={{ name, subtitle }}>
 */
export function DashboardShell({
  label,
  nav,
  user,
  aside,
  children,
}: {
  label: string;
  nav: DashNavItem[];
  user: { name: string; subtitle?: string };
  /** Optional block under the nav (e.g. trial / verification status). */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-border bg-surface px-4 py-5 lg:flex">
        <div className="flex items-center justify-between px-2">
          <Logo />
        </div>
        <p className="eyebrow mt-8 mb-3 px-3">{label}</p>
        <DashboardNav items={nav} variant="sidebar" />
        {aside ? <div className="mt-6">{aside}</div> : null}
        <div className="mt-auto space-y-3">
          <Link href="/" className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-muted transition-colors hover:text-fg">
            <ArrowLeft className="size-4" /> Back to Servhive
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-border p-3">
            <AccountButton />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              {user.subtitle ? <p className="truncate text-xs text-muted">{user.subtitle}</p> : null}
            </div>
            <ThemeToggle className="size-8" />
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-xl lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Logo />
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <AccountButton />
            </div>
          </div>
          <div className="px-4 pb-3">
            <DashboardNav items={nav} variant="tabs" />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">{children}</main>
      </div>
    </div>
  );
}
